import React, {
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import ClipLoader from "react-spinners/ClipLoader";
import { FaArrowLeft, FaLightbulb, FaRegLightbulb } from "react-icons/fa";
import { BiSolidLeftArrow, BiSolidRightArrow } from "react-icons/bi";
import { useNavigate, useParams } from "react-router-dom";
import { TfiReload } from "react-icons/tfi";
import { MdReportProblem } from "react-icons/md";

import { SnackbarContext, SnackbarType } from "../contexts/SnackbarContext";
import { ResidencyContext } from "../contexts/ResidencyContext";
import { NotesContext } from "../contexts/NotesContext";
import NoteDialog from "../components/Note-Dialog";
import ReportDialog from "../components/Report-Dialog";
import { ReportsContext } from "../contexts/ReportsContext";

// Components
const LoadingSpinner = () => (
  <div className="flex flex-col justify-evenly items-center w-full h-full">
    <ClipLoader
      color="#09BAB0"
      loading={true}
      size={50}
      aria-label="Loading Spinner"
      data-testid="loader"
    />
  </div>
);

const EmptyState = ({ message }) => (
  <div className="flex-grow overflow-y-auto flex justify-center items-center h-full">
    <p className="text-gray-500 dark:text-gray-400">{message}</p>
  </div>
);

const SectionHeader = ({ title, onBack, showBackButton }) => (
  <div
    role="alert"
    className="relative flex w-full items-center rounded-b-md border bg-primary-light border-slate-200 
               dark:bg-primary-dark dark:border-slate-500 p-3 dark:text-slate-50 shadow-lg"
  >
    {showBackButton && (
      <button
        onClick={onBack}
        className="inline-grid min-h-[36px] min-w-[36px] select-none place-items-center rounded-md border
                   border-slate-800 dark:bg-slate-800 text-center align-middle font-sans text-sm font-bold 
                   leading-none text-black bg-slate-50 dark:text-slate-50 transition-all duration-300 
                   ease-in hover:border-slate-700 lg:hidden hover:dark:bg-slate-700 hover:bg-slate-300 
                   disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
        aria-label="Go back"
      >
        <FaArrowLeft />
      </button>
    )}
    <div className="m-1.5 w-full font-sans text-base leading-none font-bold">
      {title}
    </div>
  </div>
);

const QuestionCard = ({ question, index, isSelected, hasNote, onClick }) => (
  <div
    className={`w-12 h-12 md:h-16 md:w-16 rounded-md border border-slate-200 
                dark:border-slate-500 cursor-pointer shadow-lg p-4 flex flex-col 
                justify-center items-center m-2 text-sm md:text-lg lg:text-xl 
                hover:dark:bg-slate-700 hover:bg-slate-300 transition-all duration-300 
                text-center relative ${
                  isSelected
                    ? "bg-teal-100 dark:bg-teal-800"
                    : "bg-white dark:bg-gray-800"
                }`}
    onClick={onClick}
    role="button"
    tabIndex={0}
    aria-label={`Question ${index + 1}${hasNote ? " (has note)" : ""}`}
  >
    {hasNote && (
      <FaLightbulb className="absolute top-1 right-1 text-yellow-500 mb-1 text-sm" />
    )}
    {index + 1}
  </div>
);

const ChoiceCard = ({ choice, index, isSelected, isEvaluated, isCorrect, onClick }) => {
  const getBorderColor = () => {
    if (!isEvaluated) return "dark:border-slate-500";
    if (isCorrect) return "border-green-500";
    if (isSelected && !isCorrect) return "border-red-500";
    return "dark:border-slate-500";
  };

  const getBackgroundColor = () => {
    if (!isEvaluated) return "dark:bg-slate-800 bg-slate-50";
    if (isCorrect) return "bg-green-300 dark:bg-green-800";
    if (isSelected && !isCorrect) return "bg-red-300 dark:bg-red-800";
    return "dark:bg-slate-800 bg-slate-50";
  };

  return (
    <div className="flex items-center justify-start" key={index}>
      <label className="flex items-center cursor-pointer relative shadow-lg" htmlFor={`choice-${index}`}>
        <input
          onChange={() => !isEvaluated && onClick(index)}
          type="checkbox"
          checked={isSelected}
          className="peer h-5 w-5 cursor-pointer transition-all appearance-none rounded shadow-sm border border-slate-800 checked:bg-slate-200 checked:border-slate-800 dark:border-slate-200 dark:checked:bg-slate-800 dark:checked:border-slate-800"
          id={`choice-${index}`}
          disabled={isEvaluated}
        />
        <span className="absolute text-black dark:text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <svg
            fill="none"
            width="18px"
            height="18px"
            strokeWidth="2"
            color="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5 13L9 17L19 7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </svg>
        </span>
      </label>

      <div
        className={`max-w-96 w-full border select-none cursor-pointer
          ${getBorderColor()} ${getBackgroundColor()}
          text-black dark:text-slate-50 rounded-md shadow-lg p-4 m-2 text-md transition-all duration-300 text-left`}
        onClick={() => !isEvaluated && onClick(index)}
      >
        {choice.text}
      </div>
    </div>
  );
};

const Residency = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { showSnackbar } = useContext(SnackbarContext);
  const { onCreateReport } = useContext(ReportsContext);
  const {
    residencies,
    setResidencies,
    selectedResidency,
    setSelectedResidency,
    getResidencies,
    residencyQuestions,
    setResidencyQuestions,
    getResidencyQuestionsWithDetails,
    onCreateResidencyQuestionNote,
  } = useContext(ResidencyContext);

  const { onUpdateQuestionNote, onRemoveQuestionNote } =
    useContext(NotesContext);

  // State
  const [isLoading, setIsLoading] = useState(true);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [selectedNote, setSelectedNote] = useState(null);
  const [openNoteDialog, setOpenNoteDialog] = useState(false);
  const [openReportDialog, setOpenReportDialog] = useState(false);
  
  // Test mode state
  const [checkedBoxes, setCheckedBoxes] = useState([]);
  const [evaluated, setEvaluated] = useState(false);

  // Check if current question has correct answers
  const hasCorrectAnswers = residencyQuestions[pageIndex]?.question?.correctAnswers && 
                           residencyQuestions[pageIndex]?.question?.correctAnswers.length > 0;

  // Reset test state when question changes
  useEffect(() => {
    if (residencyQuestions[pageIndex]) {
      const choices = residencyQuestions[pageIndex].question.choices;
      setCheckedBoxes(choices.map(() => false));
      setEvaluated(false);
    }
  }, [pageIndex, selectedQuestion, residencyQuestions]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event) => {
      const keyMap = {
        0: ["a", "A", "1"],
        1: ["b", "B", "2"],
        2: ["c", "C", "3"],
        3: ["d", "D", "4"],
        4: ["e", "E", "5"],
        5: ["f", "F", "6"],
      };

      if (event.key === "Enter") {
        if (hasCorrectAnswers) {
          if (evaluated) {
            setEvaluated(false);
            setCheckedBoxes(
              residencyQuestions[pageIndex].question.choices.map(() => false)
            );
          } else {
            handleEvaluation();
          }
        }
      } else if (event.key === "ArrowLeft" && pageIndex > 0) {
        handleQuestionSelect(
          residencyQuestions[pageIndex - 1].question._id,
          pageIndex - 1,
        );
      } else if (
        event.key === "ArrowRight" &&
        pageIndex < residencyQuestions.length - 1
      ) {
        handleQuestionSelect(
          residencyQuestions[pageIndex + 1].question._id,
          pageIndex + 1,
        );
      } else if (hasCorrectAnswers) {
        // Handle checkbox toggling with keyboard
        Object.entries(keyMap).forEach(([choiceIndex, keys]) => {
          if (keys.includes(event.key) && choiceIndex < checkedBoxes.length && !evaluated) {
            const checks = [...checkedBoxes];
            checks[choiceIndex] = !checks[choiceIndex];
            setCheckedBoxes(checks);
          }
        });
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [pageIndex, residencyQuestions, evaluated, checkedBoxes, hasCorrectAnswers]);

 

  // Initialize data
  useEffect(() => {
    initializeResidencies();
  }, []);

  const initializeResidencies = async () => {
    setIsLoading(true);
    try {
      const response = await getResidencies(id);
      setResidencyQuestions([]);
      setSelectedResidency(null);
      if (response.status === 200) {
        setResidencies(response.data.data);
      } else {
        showSnackbar(
          "N'a pas réussi à obtenir les catégories",
          5000,
          SnackbarType.ERROR,
        );
      }
    } catch (error) {
      showSnackbar(
        "Erreur lors du chargement des résidences",
        5000,
        SnackbarType.ERROR,
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handlers
  const handleResidencySelect = async (residencyId) => {
    setLoadingQuestions(true);
    setSelectedQuestion(null);
    setSelectedResidency(residencyId);

    try {
      const response = await getResidencyQuestionsWithDetails(residencyId);
      setResidencyQuestions(response.data);
    } catch (error) {
      showSnackbar(
        "Erreur lors du chargement des questions",
        5000,
        SnackbarType.ERROR,
      );
    } finally {
      setLoadingQuestions(false);
    }
  };

  const handleQuestionSelect = (questionId, index) => {
    setSelectedQuestion(questionId);
    setPageIndex(index);
  };

  const handleBackFromQuestions = () => {
    if (selectedQuestion) {
      setSelectedQuestion(null);
    } else {
      setSelectedResidency(null);
      setResidencyQuestions([]);
    }
  };

  const handleNoteAction = async (text) => {
    try {
      if (selectedNote?._id) {
        if (text.length === 0) {
          await onRemoveQuestionNote(selectedNote._id);
          residencyQuestions[pageIndex].note = undefined;
          showSnackbar("Note supprimée", 3000, SnackbarType.SUCCESS);
        } else {
          await onUpdateQuestionNote(selectedNote._id, text);
          residencyQuestions[pageIndex].note.note = text;
          showSnackbar("Note modifiée", 3000, SnackbarType.SUCCESS);
        }
      } else {
        const res = await onCreateResidencyQuestionNote(
          residencyQuestions[pageIndex].question._id,
          text,
        );
        residencyQuestions[pageIndex].note = res.data;
        showSnackbar("Note ajoutée", 3000, SnackbarType.SUCCESS);
      }
      setResidencyQuestions([...residencyQuestions]);
    } catch (error) {
      showSnackbar(
        "Erreur lors de la gestion de la note",
        5000,
        SnackbarType.ERROR,
      );
    } finally {
      setSelectedNote(null);
      setOpenNoteDialog(false);
    }
  };

  const handleNoteToggle = (note) => {
    setSelectedNote(note);
    setOpenNoteDialog(true);
  };

  const navigateToQuestion = (direction) => {
    const newIndex = pageIndex + direction;
    if (newIndex >= 0 && newIndex < residencyQuestions.length) {
      handleQuestionSelect(residencyQuestions[newIndex].question._id, newIndex);
    }
  };

  // Handle choice selection
  const handleChoiceSelect = (choiceIndex) => {
    if (evaluated) return;
    const checks = [...checkedBoxes];
    checks[choiceIndex] = !checks[choiceIndex];
    setCheckedBoxes(checks);
  };

  // Handle evaluation
  const handleEvaluation = () => {
    if (!hasCorrectAnswers) return;
    
    setEvaluated(true);
    
    const correctAnswers = residencyQuestions[pageIndex].question.correctAnswers;
    const selectedAnswers = checkedBoxes
      .map((checked, index) => checked ? residencyQuestions[pageIndex].question.choices[index].letter : null)
      .filter(Boolean);
    
    const arraysEqual = 
      selectedAnswers.length === correctAnswers.length &&
      selectedAnswers.every((value, index) => value === correctAnswers[index]);
    
    if (arraysEqual) {
      showSnackbar("Correct !", 3000, SnackbarType.SUCCESS);
    } else {
      showSnackbar("Incorrect. Essayez encore !", 3000, SnackbarType.ERROR);
    }
  };

  // Determine panel visibility
  const showResidencyPanel =
    !selectedResidency || (selectedResidency && !selectedQuestion);
  const showQuestionsPanel = selectedResidency;

  // Main render
  if (isLoading) {
    return (
      <div className="flex-grow-1 flex flex-row flex-wrap h-full justify-evenly items-center overflow-hidden relative">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="flex flex-row h-full overflow-hidden relative">
      <div className="w-full flex">
        {/* Residency List Panel */}
        <div
          className={`w-full md:w-1/2 lg:w-1/4 h-full flex-col ${
            selectedResidency && selectedQuestion
              ? "hidden lg:flex"
              : selectedResidency && !selectedQuestion
                ? "hidden md:flex"
                : "flex"
          }`}
        >
          <SectionHeader title="Résidanat" />
          <div className="flex-grow-1 overflow-y-auto">
            {residencies.map((residency) => (
              <div
                key={residency._id}
                onClick={() => handleResidencySelect(residency._id)}
                className="p-2"
              >
                <div
                  className={`relative flex w-full items-start rounded-md border transition-all duration-300 
                             shadow-lg p-4 cursor-pointer ${
                               residency._id === selectedResidency
                                 ? "bg-teal-100 dark:bg-teal-800"
                                 : "bg-white dark:bg-gray-800 hover:dark:bg-slate-700 hover:bg-slate-300"
                             } border-slate-200 dark:border-slate-500`}
                  role="button"
                  tabIndex={0}
                >
                  {residency.name} {new Date(residency.date).getFullYear()}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-l hidden md:block" />

        {/* Questions Grid Panel */}
        <div
          className={`w-full md:w-1/2 lg:w-[31%] h-full flex-col ${
            selectedResidency && !selectedQuestion ? "flex" : "hidden md:flex"
          }`}
        >
          <SectionHeader
            title="Questions"
            onBack={handleBackFromQuestions}
            showBackButton={true}
          />
          <div className="flex-grow-1 h-full overflow-y-auto flex flex-wrap justify-start items-start">
            {loadingQuestions ? (
              <LoadingSpinner />
            ) : residencyQuestions.length > 0 ? (
              residencyQuestions.map((item, index) => (
                <QuestionCard
                  key={item.question._id}
                  question={item.question}
                  index={index}
                  isSelected={item.question._id === selectedQuestion}
                  hasNote={!!item.note}
                  onClick={() => handleQuestionSelect(item.question._id, index)}
                />
              ))
            ) : (
              <EmptyState message="Aucune question disponible" />
            )}
          </div>
        </div>

        <div className="border-l hidden lg:block" />

        {/* Question Details Panel */}
        {selectedQuestion && residencyQuestions[pageIndex] ? (
          <div 
            className="w-full md:w-1/2 lg:w-[44%] flex justify-center flex-col"
           
          >
            <div className="w-full h-full flex flex-col items-center overflow-auto">
              {/* Action Buttons */}
              <div className="flex w-[300px] h-16 mt-4 justify-evenly items-center">
                <button
                  className="inline-grid min-h-[36px] min-w-[36px] select-none place-items-center rounded-md border
                           border-slate-800 dark:bg-slate-800 text-center align-middle font-sans text-sm font-bold 
                           leading-none text-black bg-slate-50 dark:text-slate-50 transition-all duration-300 ease-in hover:border-slate-700 
                           hover:dark:bg-slate-700 hover:bg-slate-300 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                  onClick={() => {
                    if (residencyQuestions[pageIndex].note) {
                      setSelectedNote(residencyQuestions[pageIndex].note);
                      setOpenNoteDialog(true);
                    } else {
                      setSelectedNote(residencyQuestions[pageIndex].note);
                      setOpenNoteDialog(true);
                    }
                  }}
                >
                  {residencyQuestions[pageIndex].note ? (
                    <FaLightbulb className="text-yellow-500 text-xl" />
                  ) : (
                    <FaRegLightbulb className="text-yellow-500 text-xl" />
                  )}
                </button>
                
                <div></div>
                
                <button
                  className="inline-grid min-h-[36px] min-w-[36px] select-none place-items-center rounded-md border
                           border-slate-800 dark:bg-slate-800 text-center align-middle font-sans text-sm font-bold 
                           leading-none text-black bg-slate-50 dark:text-slate-50 transition-all duration-300 ease-in hover:border-slate-700 
                           hover:dark:bg-slate-700 hover:bg-slate-300 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                  onClick={() => {
                    setOpenReportDialog(true);
                  }}
                >
                  <MdReportProblem className="text-orange-500 text-xl" />
                </button>
                
                {hasCorrectAnswers && (
                  <button
                    className="inline-grid min-h-[36px] min-w-[36px] select-none place-items-center rounded-md border
                             border-slate-800 dark:bg-slate-800 text-center align-middle font-sans text-sm font-bold 
                             leading-none text-black bg-slate-50 dark:text-slate-50 transition-all duration-300 ease-in hover:border-slate-700 
                             hover:dark:bg-slate-700 hover:bg-slate-300 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                    onClick={() => {
                      setEvaluated(false);
                      setCheckedBoxes(
                        residencyQuestions[pageIndex].question.choices.map(() => false)
                      );
                      showSnackbar("Actualiser", 1000, SnackbarType.SUCCESS);
                    }}
                  >
                    <TfiReload className="text-teal-500 text-xl" />
                  </button>
                )}
              </div>

              {/* Question Text */}
              <div
                className="h-fit max-w-[600px] border dark:border-slate-500 dark:bg-slate-800 
                         text-black bg-slate-50 dark:text-slate-50 rounded-md shadow-lg p-4 flex 
                         justify-start items-start m-4 text-lg font-black transition-all duration-300 text-left"
              >
                {pageIndex + 1}
                {") "}
                {residencyQuestions[pageIndex].question.text}
              </div>

              {/* Choices */}
              <div>
                {residencyQuestions[pageIndex].question.choices.map((choice, index) => (
                  <ChoiceCard
                    key={index}
                    choice={choice}
                    index={index}
                    isSelected={checkedBoxes[index]}
                    isEvaluated={evaluated}
                    isCorrect={evaluated && residencyQuestions[pageIndex]?.question?.correctAnswers?.includes(choice.letter)}
                    onClick={handleChoiceSelect}
                  />
                ))}
              </div>
            </div>

            {/* Navigation and Evaluation */}
            <div className="flex mb-4 w-full justify-evenly">
              <button
                className={`inline-grid h-20 min-w-[36px] select-none place-items-center rounded-md border ${
                  pageIndex > 0 ? "flex" : "hidden"
                }
                dark:border-slate-800 dark:bg-teal-800 text-center align-middle font-sans text-sm font-bold 
                leading-none text-black bg-teal-500 dark:text-slate-50 transition-all duration-300 ease-in hover:dark:border-slate-700 
                hover:dark:bg-slate-700 hover:bg-teal-300 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none`}
                onClick={() => navigateToQuestion(-1)}
              >
                <BiSolidLeftArrow />
              </button>
              
              {hasCorrectAnswers && (
                <button
                  className="inline-grid h-16 min-w-[36px] select-none place-items-center rounded-md border p-4 cursor-pointer
                           dark:border-slate-800 dark:bg-teal-800 text-center align-middle font-sans text-sm font-bold 
                           leading-none text-black bg-teal-500 dark:text-slate-50 transition-all duration-300 ease-in hover:dark:border-slate-700 
                           hover:dark:bg-slate-700 hover:bg-teal-300 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                  onClick={handleEvaluation}
                  disabled={evaluated || checkedBoxes.every(box => !box)}
                >
                  Évaluer
                </button>
              )}
              
              <button
                className={`inline-grid h-20 min-w-[36px] select-none place-items-center rounded-md border ${
                  pageIndex < residencyQuestions.length - 1 ? "flex" : "hidden"
                }
                dark:border-slate-800 dark:bg-teal-800 text-center align-middle font-sans text-sm font-bold 
                leading-none text-black bg-teal-500 dark:text-slate-50 transition-all duration-300 ease-in hover:dark:border-slate-700 
                hover:dark:bg-slate-700 hover:bg-teal-300 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none`}
                onClick={() => navigateToQuestion(1)}
              >
                <BiSolidRightArrow />
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full lg:w-[44%] h-full flex flex-col">
            <SectionHeader title="Détails" showBackButton={false} />
            <EmptyState message="Aucune question sélectionnée" />
          </div>
        )}
      </div>

      <NoteDialog
        isOpen={openNoteDialog}
        note={selectedNote}
        onClose={() => setOpenNoteDialog(false)}
        onSubmit={handleNoteAction}
      />
      
      <ReportDialog
        isOpen={openReportDialog}
        onClose={() => setOpenReportDialog(false)}
        onSubmit={(text) => {
          onCreateReport(residencyQuestions[pageIndex].question._id, text);
          showSnackbar("Signal envoyé", 3000, SnackbarType.SUCCESS);
        }}
      />
    </div>
  );
};

export default Residency;