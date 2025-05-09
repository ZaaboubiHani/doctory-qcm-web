import React, { useContext, useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import BgImg from "../assets/bg-1.jpg";
import moduleImg from "../assets/cube-3d.png";
import courseImg from "../assets/des-documents.png";
import { QuestionsContext } from "../contexts/QuestionsContext";
import { ModulesContext } from "../contexts/ModulesContext";
import { CoursesContext } from "../contexts/CoursesContext";
import { FavoritesContext } from "../contexts/FavoritesContext";
import ClipLoader from "react-spinners/ClipLoader";
import { BiSolidLeftArrow } from "react-icons/bi";
import { BiSolidRightArrow } from "react-icons/bi";
import { SnackbarContext, SnackbarType } from "../contexts/SnackbarContext";
import { useNavigate } from "react-router-dom";
import { FaLightbulb } from "react-icons/fa";
import { FaCheckCircle } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { FaRegLightbulb } from "react-icons/fa";
import { MdReportProblem } from "react-icons/md";
import { TfiReload } from "react-icons/tfi";
import NoteDialog from "../components/Note-Dialog";
import { NotesContext } from "../contexts/NotesContext";
import ReportDialog from "../components/Report-Dialog";
import { ReportsContext } from "../contexts/ReportsContext";
import WingsImg from "../assets/wings.png";

const Quiz = () => {
  const navigate = useNavigate();
  const { index } = useParams();
  const { showSnackbar } = useContext(SnackbarContext);
  const { onCreateReport } = useContext(ReportsContext);
  const { onCreateFavoriteQuestion, onRemoveFavoriteQuestion } =
    useContext(FavoritesContext);
  const {
    setQuestions,
    questions,
    answers,
    setAnswers,
    deleteAnswer,
    createAnswer,
  } = useContext(QuestionsContext);
  const { modules, selectedModule } = useContext(ModulesContext);
  const { courses, selectedCourse } = useContext(CoursesContext);
  const { onCreateQuestionNote, onUpdateQuestionNote, onRemoveQuestionNote } =
    useContext(NotesContext);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedNote, setSelectedNote] = useState();
  const [openNoteDialog, setOpenNoteDialog] = useState(false);
  const [openReportDialog, setOpenReportDialog] = useState(false);
  const [evaluated, setEvaluated] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [checkedBoxes, setCheckedBoxes] = useState([]);

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
        if (evaluated) {
          setEvaluated(false);
          setCheckedBoxes(
            questions[pageIndex]?.choices?.map(() => false) ??
            questions[pageIndex].question.choices.map(() => false)
          );
        } else {
          handleEvaluation();
        }
      } else if (event.key === "ArrowLeft") {
        if (pageIndex > 0) {
          setPageIndex(pageIndex - 1);
          setCheckedBoxes(
            questions[pageIndex - 1]?.choices?.map((e) => false) ??
            questions[pageIndex - 1].question.choices.map((e) => false)
          );
          setEvaluated(false);
        }
      } else if (event.key === "ArrowRight") {
        if (pageIndex < questions.length - 1) {
          setPageIndex(pageIndex + 1);
          setCheckedBoxes(
            questions[pageIndex + 1]?.choices?.map((e) => false) ??
            questions[pageIndex + 1].question.choices.map((e) => false)
          );
          setEvaluated(false);
        }
      } else {
        // Handle checkbox toggling
        Object.entries(keyMap).forEach(([index, keys]) => {
          if (keys.includes(event.key) && index < checkedBoxes.length) {
            const checks = [...checkedBoxes];
            checks[index] = !checks[index];
            setCheckedBoxes(checks);
          }
        });
      }
    };

    // Add event listener to the document
    document.addEventListener("keydown", handleKeyDown);

    // Cleanup event listener on unmount
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [pageIndex, questions.length, evaluated, checkedBoxes]);

  useEffect(() => {
    initData();
  }, []);

  const initData = async () => {
    setPageIndex(parseInt(index));

    setCheckedBoxes(
      questions[index]?.choices?.map((e) => false) ||
      questions[index].question.choices.map((e) => false)
    );
    setIsLoading(false);
  };

  const handleEvaluation = async () => {
    setEvaluated(true);
    const selectedChoices = (
      questions[pageIndex].choices ?? questions[pageIndex].question.choices
    )
      .filter((e, i) => checkedBoxes[i])
      .map((e) => e.letter);

    const correctChoices =
      questions[pageIndex].correctAnswers ??
      questions[pageIndex].question.correctAnswers;

    const arraysEqual =
      selectedChoices.length === correctChoices.length &&
      selectedChoices.every((value, index) => value === correctChoices[index]);

    if (arraysEqual) {
      const response = await createAnswer(
        questions[pageIndex]?._id ?? questions[pageIndex]?.question?._id
      );
      setAnswers([...answers, response.data.data]);
    } else {
      const updatedAnswers = answers.filter(
        (a) =>
          a.question !== questions[pageIndex]?._id &&
          a.question !== questions[pageIndex]?.question?._id
      );

      const answerToDelete = answers.find(
        (a) => a.question === questions[pageIndex]?._id
      );

      if (answerToDelete) {
        await deleteAnswer(answerToDelete._id);
        setAnswers(updatedAnswers);
      }
    }
  };

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 50) {
      if (pageIndex < questions.length - 1) {
        setPageIndex(pageIndex + 1);
        setCheckedBoxes(
          questions[pageIndex + 1]?.choices?.map((e) => false) ??
          questions[pageIndex + 1].question.choices.map((e) => false)
        );
        setEvaluated(false);
      }
    } else if (touchEndX.current - touchStartX.current > 50) {
      if (pageIndex > 0) {
        setPageIndex(pageIndex - 1);
        setCheckedBoxes(
          questions[pageIndex - 1]?.choices?.map((e) => false) ??
          questions[pageIndex - 1].question.choices.map((e) => false)
        );
        setEvaluated(false);
      }
    }
  };

  return (
    <div className="flex flex-row h-full overflow-hidden relative">
      {/* <img
        className="absolute top-0 left-0 w-full h-full object-cover object-top blur-sm opacity-50 -z-10"
        src={WingsImg}
        alt=""
      /> */}
      <div className="w-full flex ">
        {isLoading ? (
          <div className="flex flex-col justify-evenly items-center w-full h-full">
            <ClipLoader
              color={"#09BAB0"}
              loading={true}
              size={50}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          </div>
        ) : (
          <div className="w-full md:w-1/2 flex justify-center flex-col">
            <div className="w-full h-full flex flex-col items-center overflow-auto">
              <div className="flex w-[300px] h-16 mt-4 justify-evenly items-center">
                <button
                  class="inline-grid min-h-[36px] min-w-[36px] select-none place-items-center rounded-md border
                 border-slate-800 dark:bg-slate-800 text-center align-middle font-sans text-sm font-bold 
                 leading-none text-black bg-slate-50 dark:text-slate-50 transition-all duration-300 ease-in hover:border-slate-700 
                  hover:dark:bg-slate-700 hover:bg-slate-300 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                  onClick={() => {
                    if (questions[pageIndex].note) {
                      setSelectedNote(questions[pageIndex].note);
                      setOpenNoteDialog(true);
                    }
                    else {
                      setSelectedNote(questions[pageIndex].note);
                      setOpenNoteDialog(true);
                    }
                  }}
                >
                  {questions[pageIndex].note ? (
                    <FaLightbulb
                      className="text-yellow-500 text-xl"

                    />
                  ) : (
                    <FaRegLightbulb
                      className="text-yellow-500 text-xl"

                    />
                  )}
                </button>
                <button
                  class="inline-grid min-h-[36px] min-w-[36px] select-none place-items-center rounded-md border
                 border-slate-800 dark:bg-slate-800 text-center align-middle font-sans text-sm font-bold 
                 leading-none text-black bg-slate-50 dark:text-slate-50 transition-all duration-300 ease-in hover:border-slate-700 
                  hover:dark:bg-slate-700 hover:bg-slate-300 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                  onClick={() => {
                    if (questions[pageIndex].favourite) {
                      onRemoveFavoriteQuestion(questions[pageIndex]._id);
                      questions[pageIndex].favourite = false;
                      setQuestions([...questions]);
                      showSnackbar(
                        "Retiré des favoris",
                        3000,
                        SnackbarType.SUCCESS
                      );
                    }
                    else {
                      onCreateFavoriteQuestion(questions[pageIndex]._id);
                      questions[pageIndex].favourite = true;
                      setQuestions([...questions]);
                      showSnackbar(
                        "Ajouté aux favoris",
                        3000,
                        SnackbarType.SUCCESS
                      );
                    }
                  }}
                >
                  {questions[pageIndex].favourite ? (
                    <FaHeart

                      className="text-red-500 text-xl "
                    />
                  ) : (
                    <FaRegHeart
                    
                      className="text-red-500 text-xl "
                    />
                  )}
                </button>
                <div></div>
                <button
                  class="inline-grid min-h-[36px] min-w-[36px] select-none place-items-center rounded-md border
                 border-slate-800 dark:bg-slate-800 text-center align-middle font-sans text-sm font-bold 
                 leading-none text-black bg-slate-50 dark:text-slate-50 transition-all duration-300 ease-in hover:border-slate-700 
                  hover:dark:bg-slate-700 hover:bg-slate-300 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                  onClick={() => {
                    setOpenReportDialog(true);
                  }}
                >
                  <MdReportProblem className="text-orange-500 text-xl" />
                </button>
                <button
                  class="inline-grid min-h-[36px] min-w-[36px] select-none place-items-center rounded-md border
                 border-slate-800 dark:bg-slate-800 text-center align-middle font-sans text-sm font-bold 
                 leading-none text-black bg-slate-50 dark:text-slate-50 transition-all duration-300 ease-in hover:border-slate-700 
                  hover:dark:bg-slate-700 hover:bg-slate-300 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                  onClick={() => {
                    setEvaluated(false);
                    setCheckedBoxes(
                      questions[pageIndex]?.choices?.map((e) => false) ??
                      questions[pageIndex].question.choices.map((e) => false)
                    );
                    showSnackbar("Actualiser", 1000, SnackbarType.SUCCESS);
                  }}
                >
                  <TfiReload className="text-teal-500 text-xl" />
                </button>
              </div>
              <div
                className="h-fit max-w-[600px] border
                dark:border-slate-500 dark:bg-slate-800 text-black bg-slate-50 dark:text-slate-50 rounded-md
                shadow-lg p-4 flex justify-start items-start m-4 text-lg font-black transition-all duration-300 text-left"
              >
                {pageIndex + 1}
                {") " +
                  (questions[pageIndex]?.text ??
                    questions[pageIndex].question.text)}
              </div>
              <div>
                {(
                  questions[pageIndex].choices ??
                  questions[pageIndex].question.choices
                ).map((c, i) => (
                  <div className="flex items-center justify-start" key={i}>
                    <label
                      class="flex items-center cursor-pointer relative shadow-lg"
                      for={i}
                    >
                      <input
                        onChange={() => {
                          var checks = [...checkedBoxes];
                          checks[i] = !checks[i];
                          setCheckedBoxes(checks);
                          setEvaluated(false);
                        }}
                        type="checkbox"
                        checked={checkedBoxes[i]}
                        class="peer h-5 w-5 cursor-pointer transition-all appearance-none rounded shadow-sm  border border-slate-800 checked:bg-slate-200 checked:border-slate-800 dark:border-slate-200 dark:checked:bg-slate-800 dark:checked:border-slate-800"
                        id={i}
                      />
                      <span class="absolute text-black dark:text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <svg
                          fill="none"
                          width="18px"
                          height="18px"
                          stroke-width="2"
                          color="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M5 13L9 17L19 7"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          ></path>
                        </svg>
                      </span>
                    </label>

                    <div
                      className={`max-w-96 w-full border select-none cursor-pointer
${evaluated
                          ? questions[pageIndex].correctAnswers.includes(c.letter)
                            ? "border-green-500 bg-green-300 dark:bg-green-800 "
                            : checkedBoxes[i]
                              ? "border-red-500 bg-red-300 dark:bg-red-800 "
                              : "dark:border-slate-500 dark:bg-slate-800 bg-slate-50"
                          : "dark:border-slate-500 dark:bg-slate-800 bg-slate-50"
                        }
                       text-black  dark:text-slate-50 
                      rounded-md shadow-lg p-4 m-2 text-md transition-all duration-300 text-left`}
                      onClick={() => {
                        var checks = [...checkedBoxes];
                        checks[i] = !checks[i];
                        setCheckedBoxes(checks);
                        setEvaluated(false);
                      }}
                    >
                      {c.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex mb-4 w-full justify-evenly">
              <button
                class={`inline-grid h-20 min-w-[36px] select-none place-items-center rounded-md border ${pageIndex > 0 ? "flex" : "hidden"
                  }
             dark:border-slate-800 dark:bg-teal-800 text-center align-middle font-sans text-sm font-bold 
             leading-none text-black bg-teal-500 dark:text-slate-50 transition-all duration-300 ease-in hover:dark:border-slate-700 
              hover:dark:bg-slate-700 hover:bg-teal-300 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none`}
                onClick={() => {
                  setPageIndex(pageIndex - 1);

                  setCheckedBoxes(
                    questions[pageIndex - 1]?.choices?.map((e) => false) ??
                    questions[pageIndex - 1].question.choices.map(
                      (e) => false
                    )
                  );
                  setEvaluated(false);
                }}
              >
                <BiSolidLeftArrow />
              </button>
              <button
                class={`inline-grid h-16 min-w-[36px] select-none place-items-center rounded-md border p-4 cursor-pointer
             dark:border-slate-800 dark:bg-teal-800 text-center align-middle font-sans text-sm font-bold 
             leading-none text-black bg-teal-500 dark:text-slate-50 transition-all duration-300 ease-in hover:dark:border-slate-700 
              hover:dark:bg-slate-700 hover:bg-teal-300 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none`}
                onClick={async () => {
                  handleEvaluation();
                }}
              >
                Évaluer
              </button>
              <button
                class={`inline-grid h-20 min-w-[36px] select-none place-items-center rounded-md border ${pageIndex < questions.length - 1 ? "flex" : "hidden"
                  }
           dark:border-slate-800 dark:bg-teal-800 text-center align-middle font-sans text-sm font-bold 
           leading-none text-black bg-teal-500 dark:text-slate-50 transition-all duration-300 ease-in hover:dark:border-slate-700 
            hover:dark:bg-slate-700 hover:bg-teal-300 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none`}
                onClick={() => {
                  setPageIndex(pageIndex + 1);

                  setCheckedBoxes(
                    questions[pageIndex + 1]?.choices?.map((e) => false) ??
                    questions[pageIndex + 1].question.choices.map(
                      (e) => false
                    )
                  );
                  setEvaluated(false);
                }}
              >
                <BiSolidRightArrow />
              </button>
            </div>
          </div>
        )}
        <div className="border-l hidden md:block" />
        <div className="md:w-1/2 lg:w-1/2 hidden md:flex h-full flex-col">
          <div
            role="alert"
            className="relative w-full rounded-b-md border bg-primary-light border-slate-200 dark:bg-primary-dark dark:border-slate-500 p-3 dark:text-slate-50 shadow-lg"
          >
            <div className="font-sans text-base font-bold">
              {" "}
              Module: {modules.filter((m) => m._id === selectedModule)[0]?.name}
            </div>
            <div className="font-sans text-base font-bold">
              {" "}
              Cour: {courses.filter((m) => m._id === selectedCourse)[0]?.name}
            </div>
          </div>
          <div className="flex-grow-1 overflow-y-auto flex flex-wrap justify-start items-start">
            {questions.map((e, index) => (
              <div
                key={e._id}
                className={`w-12 h-12 md:h-16 md:w-16 ${index === pageIndex
                  ? "bg-teal-100 dark:bg-teal-800"
                  : "bg-white dark:bg-gray-800"
                  } rounded-md border border-slate-200 
             dark:border-slate-500 cursor-pointer
               shadow-lg p-4 flex flex-col justify-center items-center m-2 text-sm
               md:text-lg lg:text-xl hover:dark:bg-slate-700 hover:bg-slate-300
               transition-all duration-300 text-center relative`}
                onClick={() => {
                  setIsLoading(true);
                  setPageIndex(parseInt(index));
                  setCheckedBoxes(
                    questions[pageIndex + 1]?.choices?.map((e) => false) ??
                    questions[pageIndex + 1].question.choices.map(
                      (e) => false
                    )
                  );
                  setIsLoading(false);
                  setEvaluated(false);
                }}
              >
                <div className="absolute top-1 right-1">
                  {e.note ? (
                    <FaLightbulb className="text-yellow-500 mb-1 text-sm" />
                  ) : null}
                  {answers.map((a) => a.question).includes(e._id) ? (
                    <FaCheckCircle className="text-green-500 text-sm" />
                  ) : null}
                </div>
                {index + 1}
              </div>
            ))}
          </div>
        </div>
      </div>
      <NoteDialog
        isOpen={openNoteDialog}
        note={selectedNote}
        onClose={() => {
          setOpenNoteDialog(false);
        }}
        onSubmit={async (text) => {
          if (selectedNote?._id) {
            if (text.length === 0) {
              onRemoveQuestionNote(selectedNote?._id);
              questions[pageIndex].note = undefined;
              setQuestions([...questions]);
              showSnackbar("Note supprimée", 3000, SnackbarType.SUCCESS);
            } else {
              onUpdateQuestionNote(selectedNote?._id, text);
              questions[pageIndex].note.note = text;
              setQuestions([...questions]);
              showSnackbar("Note modifiée", 3000, SnackbarType.SUCCESS);
            }
          } else {
            const res = await onCreateQuestionNote(
              questions[pageIndex]._id,
              text
            );
            questions[pageIndex].note = res.data.data;
            setQuestions([...questions]);
            showSnackbar("Note ajoutée", 3000, SnackbarType.SUCCESS);
          }
          setSelectedNote(null);
        }}
      />
      <ReportDialog
        isOpen={openReportDialog}
        onClose={() => {
          setOpenReportDialog(false);
        }}
        onSubmit={(text) => {
          onCreateReport(questions[pageIndex]._id, text);
          showSnackbar("Signal envoyé", 3000, SnackbarType.SUCCESS);
        }}
      />
    </div>
  );
};

export default Quiz;
