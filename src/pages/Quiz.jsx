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
    initData();
  }, []);

  const initData = async () => {
    setPageIndex(parseInt(index));
    setCheckedBoxes(questions[index].choices.map((e) => false));
    setIsLoading(false);
  };

  return (
    <div className="flex flex-row h-full overflow-hidden relative">
      <img
        className="fixed w-full -z-10 opacity-50 h-full object-cover"
        src={BgImg}
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
          <div className="w-full md:w-1/2 flex justify-center overflow-auto ">
            <div className="w-full h-fit flex flex-col items-center pb-32 ">
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
                      questions[pageIndex].choices.map((e) => false)
                    );
                    showSnackbar("Actualiser", 1000, SnackbarType.SUCCESS);
                  }}
                  className="text-teal-500 text-4xl cursor-pointer hover:text-5xl transition-all duration-300"
                />
              </div>
              <div
                className={`min-h-20 max-w-[600px] bg-white rounded-xl cursor-pointer
                shadow-lg p-4 flex justify-start items-center m-4 
                text-lg font-black 
                transition-all duration-300 text-left`}
              >
                {pageIndex + 1}
                {") " + questions[pageIndex].text}
              </div>
              <div>
                {questions[pageIndex].choices.map((c, i) => (
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
                      className={`max-w-96 bg-white rounded-xl cursor-pointer
                      shadow-lg p-4 flex justify-start items-start m-4 
                      text-lg font-black ${
                        evaluated
                          ? questions[pageIndex].correctAnswers.includes(
                              c.letter
                            )
                            ? "border-2 border-green-500"
                            : "border-2 border-red-500"
                          : "border-2 border-black"
                      }
                        transition-all duration-300 text-left`}
                      onClick={() => {
                        var checks = [...checkedBoxes];
                        checks[i] = !checks[i];
                        setCheckedBoxes(checks);
                      }}
                    >
                      {c.letter}
                      {") " + c.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex mt-8 fixed bottom-1">
              <div
                className={`h-20 bg-teal-500 rounded-xl cursor-pointer
                  shadow-lg p-4 justify-start items-center m-4 
                  text-lg font-black ${pageIndex > 0 ? "flex" : "hidden"}
                  transition-all duration-300 text-left`}
                onClick={() => {
                  setPageIndex(pageIndex - 1);
                  setCheckedBoxes(
                    questions[pageIndex + 1].choices.map((e) => false)
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
                  const selectedChoices = questions[pageIndex].choices
                  .filter((e, i) => checkedBoxes[i])
                  .map((e) => e.letter);
                
                const correctChoices = questions[pageIndex].correctAnswers;
                
                const arraysEqual =
                  selectedChoices.length === correctChoices.length &&
                  selectedChoices.every((value, index) => value === correctChoices[index]);
                
                if (arraysEqual) {
                  const response = await createAnswer(questions[pageIndex]._id);
                  setAnswers([
                    ...answers,
                    {
                      _id: response.data._id,
                      question: { _id: response.data.question },
                    },
                  ]);
                } else {
                  const updatedAnswers = answers.filter(
                    (a) => a.question._id !== questions[pageIndex]._id
                  );
                
                  const answerToDelete = answers.find(
                    (a) => a.question._id === questions[pageIndex]._id
                  );
                
                  if (answerToDelete) {
                    await deleteAnswer(answerToDelete._id);
                    setAnswers(updatedAnswers);
                  }
                }
                
                setEvaluated(true);
                
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
                    questions[pageIndex + 1].choices.map((e) => false)
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
          <div className="min-h-20 bg-teal-500 shadow-lg font-black flex flex-col justify-center items-start pl-8">
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
                className={`w-20 h-20 ${
                  index === pageIndex ? "bg-teal-100" : "bg-white"
                } rounded-xl cursor-pointer
                    shadow-lg p-4 flex flex-col justify-center items-center m-4 
                    text-lg lg:text-xl font-black hover:text-xl lg:hover:text-2xl 
                    transition-all duration-300 text-center relative`}
                onClick={() => {
                  setIsLoading(true);
                  setPageIndex(parseInt(index));
                  setCheckedBoxes(questions[index].choices.map((e) => false));
                  setIsLoading(false);
                  setEvaluated(false);
                }}
              >
                <div className="absolute top-2 right-2">
                  {e.note ? (
                    <FaLightbulb className="text-yellow-500 mb-1" />
                  ) : null}
                  {answers.map((a) => a.question._id).includes(e._id) ? (
                    <FaCheckCircle className="text-green-500 " />
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
