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
        questions[pageIndex]._id ?? questions[pageIndex].question._id
      );
      setAnswers([
        ...answers,
        {
          _id: response.data._id,
          question: { _id: response.data.question },
        },
      ]);
    } else {
      const updatedAnswers = answers.filter(
        (a) =>
          a.question._id !== questions[pageIndex]._id &&
          a.question._id !== questions[pageIndex].question._id
      );

      const answerToDelete = answers.find(
        (a) =>
          a.question._id === questions[pageIndex]._id ||
          a.question._id === questions[pageIndex].question._id
      );

      if (answerToDelete) {
        await deleteAnswer(answerToDelete._id);
        setAnswers(updatedAnswers);
      }
    }

    setEvaluated(true);
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
    <div
      className="flex flex-row h-full overflow-hidden relative"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <img
        className="absolute top-0 left-0 w-full h-full object-cover object-top blur-sm opacity-50 -z-10"
        src={WingsImg}
        alt=""
      />
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
                {questions[pageIndex].note ? (
                  <FaLightbulb
                    className="text-yellow-500 text-4xl cursor-pointer hover:text-5xl transition-all duration-300"
                    onClick={() => {
                      setSelectedNote(questions[pageIndex].note);
                      setOpenNoteDialog(true);
                    }}
                  />
                ) : (
                  <FaRegLightbulb
                    className="text-yellow-500 text-4xl cursor-pointer hover:text-5xl transition-all duration-300"
                    onClick={() => {
                      setSelectedNote(questions[pageIndex].note);
                      setOpenNoteDialog(true);
                    }}
                  />
                )}
                {questions[pageIndex].isFavourite ? (
                  <FaHeart
                    onClick={() => {
                      onRemoveFavoriteQuestion(questions[pageIndex]._id);
                      questions[pageIndex].isFavourite = false;
                      setQuestions([...questions]);
                      showSnackbar(
                        "Retiré des favoris",
                        3000,
                        SnackbarType.SUCCESS
                      );
                    }}
                    className="text-red-500 text-4xl cursor-pointer hover:text-5xl transition-all duration-300"
                  />
                ) : (
                  <FaRegHeart
                    onClick={() => {
                      onCreateFavoriteQuestion(questions[pageIndex]._id);
                      questions[pageIndex].isFavourite = true;
                      setQuestions([...questions]);
                      showSnackbar(
                        "Ajouté aux favoris",
                        3000,
                        SnackbarType.SUCCESS
                      );
                    }}
                    className="text-red-500 text-4xl cursor-pointer hover:text-5xl transition-all duration-300"
                  />
                )}
                <div></div>
                <MdReportProblem
                  onClick={() => {
                    setOpenReportDialog(true);
                  }}
                  className="text-orange-500 text-4xl cursor-pointer hover:text-5xl transition-all duration-300"
                />
                <TfiReload
                  onClick={() => {
                    setEvaluated(false);
                    setCheckedBoxes(
                      questions[pageIndex]?.choices?.map((e) => false) ??
                        questions[pageIndex].question.choices.map((e) => false)
                    );
                    showSnackbar("Actualiser", 1000, SnackbarType.SUCCESS);
                  }}
                  className="text-teal-500 text-4xl cursor-pointer hover:text-5xl transition-all duration-300 "
                />
              </div>
              <div
                className={`h-fit max-w-[600px] bg-white rounded-xl cursor-pointer
                shadow-lg p-4 flex justify-start items-center m-4 
                text-lg font-black 
                transition-all duration-300 text-left`}
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
                    <input
                      type="checkbox"
                      className="min-w-6 min-h-6 ml-2 
                    border-2 border-gray-400 
                    checked:bg-teal-500 checked:border-transparent 
                    accent-teal-500 rounded-lg transition-all duration-300 
                    focus:outline-none focus:ring-2 focus:ring-teal-500"
                      onChange={() => {
                        var checks = [...checkedBoxes];
                        checks[i] = !checks[i];
                        setCheckedBoxes(checks);
                      }}
                      checked={checkedBoxes[i]}
                    />
                    <div
                      className={`max-w-96 w-full bg-white rounded-xl cursor-pointer
                      shadow-lg p-4 flex justify-start items-start m-2 
                      text-md ${
                        evaluated
                          ? (
                              questions[pageIndex].correctAnswers ??
                              questions[pageIndex].question.correctAnswers
                            ).includes(c.letter)
                            ? "border-2 border-green-500"
                            : "border-2 border-red-500"
                          : "border-0"
                      }
                        transition-all duration-300 text-left`}
                      onClick={() => {
                        var checks = [...checkedBoxes];
                        checks[i] = !checks[i];
                        setCheckedBoxes(checks);
                      }}
                    >
                      {c.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex bottom-1 bg-white w-full justify-evenly">
              <div
                className={`h-20 bg-teal-500 rounded-xl cursor-pointer
                  shadow-lg p-4 justify-start items-center m-4 
                  text-lg font-black ${pageIndex > 0 ? "flex" : "hidden"}
                  transition-all duration-300 text-left`}
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
              </div>
              <div
                className={`h-20 bg-teal-500 rounded-xl cursor-pointer
                  shadow-lg p-4 flex justify-start items-center m-4 
                  text-lg font-black hover:text-xl lg:hover:text-2xl
                  transition-all duration-300 text-left`}
                onClick={async () => {
                  handleEvaluation();
                }}
              >
                évaluer
              </div>
              <div
                className={`h-20 bg-teal-500 rounded-xl cursor-pointer
                  shadow-lg p-4 justify-start items-center m-4 
                  text-lg font-black ${
                    pageIndex < questions.length - 1 ? "flex" : "hidden"
                  }
                transition-all duration-300 text-left`}
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
              </div>
            </div>
          </div>
        )}
        <div className="border-l hidden md:block" />
        <div className="md:w-1/2 lg:w-1/2 hidden md:flex h-full flex-col">
          <div className="min-h-20 bg-teal-500 shadow-lg font-black flex flex-col justify-center items-start pl-8 rounded-b-2xl">
            <div>
              Module: {modules.filter((m) => m._id === selectedModule)[0]?.name}
            </div>
            <div>
              Cour: {courses.filter((m) => m._id === selectedCourse)[0]?.name}
            </div>
          </div>
          <div className="flex-grow-1 overflow-y-auto flex flex-wrap justify-start items-start">
            {questions.map((e, index) => (
              <div
                key={e._id}
                className={`w-16 h-16 ${
                  index === pageIndex ? "bg-teal-200" : "bg-white"
                } rounded-xl cursor-pointer
                    shadow-lg p-4 flex flex-col justify-center items-center m-2 
                    border-2 border-teal-500 
                    text-lg lg:text-xl font-black hover:text-xl lg:hover:text-2xl 
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
                  {answers.map((a) => a.question._id).includes(e._id) ||
                  answers
                    .map((a) => a.question._id)
                    .includes(e.question._id) ? (
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
            questions[pageIndex].note = res.data;
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
