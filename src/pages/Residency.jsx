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

import { SnackbarContext, SnackbarType } from "../contexts/SnackbarContext";
import { ResidencyContext } from "../contexts/ResidencyContext";
import { NotesContext } from "../contexts/NotesContext";
import NoteDialog from "../components/Note-Dialog";

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
      <FaLightbulb className="absolute top-[2px] right-[2px] md:top-1 md:right-1 text-yellow-500 mb-1 text-xs md:text-sm" />
    )}
    {index + 1}
  </div>
);

const ChoiceCard = ({ choice, index }) => (
  <div className="flex items-center justify-center" key={index}>
    <div
      className="max-w-96 w-full border dark:border-slate-500 dark:bg-slate-800 
                 text-black bg-slate-50 dark:text-slate-50 rounded-md shadow-lg p-4 m-2 
                 text-md transition-all duration-300 text-left"
    >
      {choice.text}
    </div>
  </div>
);

const Residency = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  // id will be category._id
  console.log(id);
  const { showSnackbar } = useContext(SnackbarContext);
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

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowLeft" && pageIndex > 0) {
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
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [pageIndex, residencyQuestions]);

  // Initialize data
  useEffect(() => {
    initializeResidencies();
  }, []);

  const initializeResidencies = async () => {
    setIsLoading(true);
    try {
      const response = await getResidencies(id);
      setResidencyQuestions([]);
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

  // Determine panel visibility
  const showResidencyPanel =
    !selectedResidency || (selectedResidency && !selectedQuestion);
  const showQuestionsPanel = selectedResidency;
  const showDetailsPanel = true; // Always shown on lg screens, conditionally on mobile

  // Main render
  if (isLoading) {
    return (
      <div className="flex-grow-1 flex flex-row flex-wrap h-full justify-evenly items-center overflow-hidden relative">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="flex-grow-1 flex flex-row flex-wrap h-full justify-evenly items-center overflow-hidden relative">
      <div className="w-full h-full flex">
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
        <div
          className={`w-full lg:w-[44%] h-full flex flex-col ${
            selectedQuestion ? "flex md:w-1/2" : "hidden lg:flex"
          }`}
        >
          <SectionHeader
            title="Détails"
            onBack={() => setSelectedQuestion(null)}
            showBackButton={true}
          />
          <div className="flex-grow h-full flex flex-col overflow-y-auto">
            {selectedQuestion && residencyQuestions[pageIndex] ? (
              <div className="w-full flex flex-col h-full">
                <div className="w-full h-full flex flex-col items-center overflow-y-auto">
                  {/* Question Text and Note Toggle */}
                  <div className="flex items-center">
                    <div
                      className="h-fit max-w-[600px] border dark:border-slate-500 dark:bg-slate-800 
                                 text-black bg-slate-50 dark:text-slate-50 rounded-md shadow-lg p-4 flex 
                                 justify-start items-start m-4 text-lg font-black transition-all duration-300 text-left"
                    >
                      {pageIndex + 1}
                      {") "}
                      {residencyQuestions[pageIndex].question.text}
                    </div>
                    <button
                      onClick={() =>
                        handleNoteToggle(residencyQuestions[pageIndex].note)
                      }
                      className="inline-grid min-h-[36px] min-w-[36px] select-none place-items-center 
                                 rounded-md border border-slate-800 dark:bg-slate-800 text-center 
                                 align-middle font-sans text-sm font-bold leading-none text-black 
                                 bg-slate-50 dark:text-slate-50 transition-all duration-300 ease-in 
                                 hover:border-slate-700 hover:dark:bg-slate-700 hover:bg-slate-300 
                                 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                      aria-label={
                        residencyQuestions[pageIndex].note
                          ? "View note"
                          : "Add note"
                      }
                    >
                      {residencyQuestions[pageIndex].note ? (
                        <FaLightbulb className="text-yellow-500 text-xl" />
                      ) : (
                        <FaRegLightbulb className="text-yellow-500 text-xl" />
                      )}
                    </button>
                  </div>

                  {/* Choices */}
                  <div className="w-full">
                    {residencyQuestions[pageIndex].question.choices.map(
                      (choice, index) => (
                        <ChoiceCard key={index} choice={choice} index={index} />
                      ),
                    )}
                  </div>
                </div>

                {/* Navigation Arrows */}
                <div
                  role="alert"
                  className="flex bottom-1 w-full justify-evenly mb-4"
                >
                  <NavigationButton
                    direction="left"
                    onClick={() => navigateToQuestion(-1)}
                    disabled={pageIndex === 0}
                  />
                  <NavigationButton
                    direction="right"
                    onClick={() => navigateToQuestion(1)}
                    disabled={pageIndex === residencyQuestions.length - 1}
                  />
                </div>
              </div>
            ) : (
              <EmptyState message="Aucune question sélectionnée" />
            )}
          </div>
        </div>
      </div>

      <NoteDialog
        isOpen={openNoteDialog}
        note={selectedNote}
        onClose={() => setOpenNoteDialog(false)}
        onSubmit={handleNoteAction}
      />
    </div>
  );
};

const NavigationButton = ({ direction, onClick, disabled }) => {
  const Icon = direction === "left" ? BiSolidLeftArrow : BiSolidRightArrow;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-grid h-20 min-w-[36px] select-none place-items-center rounded-md 
                  border dark:border-slate-800 dark:bg-teal-800 text-center align-middle 
                  font-sans text-sm font-bold leading-none text-black bg-teal-500 
                  dark:text-slate-50 transition-all duration-300 ease-in 
                  hover:dark:bg-slate-700 hover:bg-teal-300 
                  disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none
                  ${disabled ? "hidden" : "flex"}`}
      aria-label={`Go to ${direction === "left" ? "previous" : "next"} question`}
    >
      <Icon />
    </button>
  );
};

export default Residency;
