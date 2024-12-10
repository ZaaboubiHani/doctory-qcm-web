import React, { useContext, useState, useEffect, useRef } from "react";
import BgImg from "../assets/bg-1.jpg";
import { CategoriesContext } from "../contexts/CategoriesContext";
import ClipLoader from "react-spinners/ClipLoader";
import { SnackbarContext, SnackbarType } from "../contexts/SnackbarContext";
import { ResidencyContext } from "../contexts/ResidencyContext";
import { FaArrowAltCircleLeft } from "react-icons/fa";
import { QuestionsContext } from "../contexts/QuestionsContext";
import { ModulesContext } from "../contexts/ModulesContext";
import { CoursesContext } from "../contexts/CoursesContext";
import { FavoritesContext } from "../contexts/FavoritesContext";
import { BiSolidLeftArrow } from "react-icons/bi";
import { BiSolidRightArrow } from "react-icons/bi";
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

const Residency = () => {
  const navigate = useNavigate();
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
  const { onCreateQuestionNote, onUpdateQuestionNote, onRemoveQuestionNote } =
  useContext(NotesContext);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState();
  const [pageIndex, setPageIndex] = useState(0);

  const [selectedNote, setSelectedNote] = useState();
  const [openNoteDialog, setOpenNoteDialog] = useState(false);
  useEffect(() => {
    initData();
  }, []);
  const initData = async () => {
    setIsLoading(true);

    const response = await getResidencies();

    if (response.status === 200) {
      const sortedResidencies = response.data.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      setResidencies(sortedResidencies);
    } else {
      showSnackbar(
        "N'a pas réussi à obtenir les catégories",
        5000,
        SnackbarType.ERROR
      );
    }

    setIsLoading(false);
  };

  return (
    <div
      className="flex-grow-1 flex flex-row flex-wrap h-full 
    justify-evenly items-center overflow-auto relative "
    >
      <img
        className="fixed w-full h-full -z-10 opacity-50 object-cover"
        src={BgImg}
        alt=""
      />
      {isLoading ? (
        <div className="flex flex-col justify-evenly items-center">
          <ClipLoader
            color={"#09BAB0"}
            loading={true}
            size={50}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      ) : (
        <div className="w-full h-full flex">
          <div
            className={`w-full md:w-1/2 lg:w-1/3 h-full flex-col ${
              selectedResidency && selectedQuestion
                ? "hidden lg:flex"
                : selectedResidency && !selectedQuestion
                ? "hidden md:flex"
                : "flex"
            }`}
          >
            <div
              className="min-h-20 flex-shrink shadow-lg bg-teal-500 
                  text-xl font-black flex justify-center items-center"
            >
              Résidanat
            </div>
            <div className="flex-grow-1 overflow-y-auto ">
              {residencies.map((e, index) => (
                <div
                  key={e._id}
                  onClick={async () => {
                    setLoadingQuestions(true);
                    setSelectedResidency(e._id);
                    const response = await getResidencyQuestionsWithDetails(
                      e._id
                    );
                    console.log(response);
                    setResidencyQuestions(response.data);
                    setLoadingQuestions(false);
                  }}
                  className={`h-20 ${
                    e._id === selectedResidency ? "bg-teal-100" : "bg-white"
                  } rounded-xl cursor-pointer
                    shadow-lg p-4 flex justify-start items-center m-4 
                    text-lg lg:text-xl font-black hover:text-xl lg:hover:text-2xl transition-all duration-300 text-left`}
                >
                  <div className="flex-1">
                    {e.name} {new Date(e.date).getFullYear()}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="border-l hidden md:block" />
          <div
            className={`w-full md:w-1/2 lg:w-1/3 h-full  flex-col ${
              selectedResidency && !selectedQuestion ? "flex" : "hidden md:flex"
            }`}
          >
            <div
              className="min-h-20 shadow-lg flex-shrink bg-teal-500 
                  text-xl font-black flex justify-center items-center px-8"
            >
              <FaArrowAltCircleLeft
                className={`text-3xl min-h-8 mr-2 ${
                  selectedQuestion ? "flex lg:hidden" : "md:hidden"
                }`}
                onClick={() => {
                  if (selectedQuestion) {
                    setSelectedQuestion(undefined);
                  } else {
                    setSelectedResidency(undefined);
                    setResidencyQuestions(undefined);
                  }
                }}
              ></FaArrowAltCircleLeft>
              Questions
            </div>
            <div className="flex-grow-1 h-full overflow-y-auto flex flex-wrap justify-start items-start">
              {loadingQuestions ? (
                <div className="flex flex-col justify-evenly items-center w-full h-full">
                  <ClipLoader
                    color={"#09BAB0"}
                    loading={true}
                    size={50}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                  />
                </div>
              ) : residencyQuestions.length > 0 ? (
                residencyQuestions?.map((e, index) => (
                  <div
                    key={e.question._id}
                    className={`w-20 h-20 ${
                      e.question._id === selectedQuestion
                        ? "bg-teal-100"
                        : "bg-white"
                    } rounded-xl cursor-pointer
               shadow-lg p-4 flex flex-col justify-center items-center m-4 
               text-lg lg:text-xl font-black hover:text-xl lg:hover:text-2xl 
               transition-all duration-300 text-center relative`}
                    onClick={() => {
                      setSelectedQuestion(e.question._id);
                      setPageIndex(index);
                    }}
                  >
                    {index + 1}
                  </div>
                ))
              ) : (
                <div className="flex-grow-1 overflow-y-auto flex-1 h-full">
                  <div className="h-full flex justify-center items-center">
                    aucune question disponible
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="border-l hidden lg:block" />
          <div
            className={`w-full lg:w-1/3 h-full flex-col ${
              selectedQuestion ? "flex md:w-1/2" : "hidden lg:flex"
            }`}
          >
            <div className="min-h-20 bg-teal-500 text-xl shadow-lg font-black flex justify-center items-center">
              <FaArrowAltCircleLeft
                className="text-3xl min-h-8 mr-2 md:hidden"
                onClick={() => {
                  setSelectedQuestion(undefined);
                }}
              ></FaArrowAltCircleLeft>
              Details
            </div>
            <div className="flex-grow-1 overflow-y-auto flex-1">
              {selectedQuestion ? (
                <div className="w-full  flex justify-center overflow-auto ">
                  <div className="w-full h-fit flex flex-col items-center pb-32 ">
                    <div className="flex w-[300px] h-16 mt-4 justify-evenly items-center">
                      {residencyQuestions[pageIndex]?.note ? (
                        <FaLightbulb
                          className="text-yellow-500 text-4xl cursor-pointer hover:text-5xl transition-all duration-300"
                          onClick={() => {
                            setSelectedNote(residencyQuestions[pageIndex].note);
                            setOpenNoteDialog(true);
                          }}
                        />
                      ) : (
                        <FaRegLightbulb
                          className="text-yellow-500 text-4xl cursor-pointer hover:text-5xl transition-all duration-300"
                          onClick={() => {
                            setSelectedNote(residencyQuestions[pageIndex].note);
                            setOpenNoteDialog(true);
                          }}
                        />
                      )}
                    </div>
                    <div
                      className={`min-h-20 max-w-[600px] bg-white rounded-xl cursor-pointer
                shadow-lg p-4 flex justify-start items-center m-4 
                text-lg font-black 
                transition-all duration-300 text-left`}
                    >
                      {pageIndex + 1}
                      {") " + residencyQuestions[pageIndex].question.text}
                    </div>
                    <div>
                      {residencyQuestions[pageIndex].question.choices.map(
                        (c, i) => (
                          <div
                            className="flex items-center justify-start"
                            key={i}
                          >
                            <div
                              className={`max-w-96 bg-white rounded-xl cursor-pointer
                      shadow-lg p-4 flex justify-start items-start m-4 
                      text-lg font-black border-2 border-black"
                        transition-all duration-300 text-left`}
                              onClick={() => {}}
                            >
                              {c.letter}
                              {") " + c.text}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                  <div className="flex mt-8 fixed bottom-1">
                    <div
                      className={`h-20 bg-teal-500 rounded-xl cursor-pointer
                  shadow-lg p-4 justify-start items-center m-4 
                  text-lg font-black ${pageIndex > 0 ? "flex" : "hidden"}
                  transition-all duration-300 text-left`}
                      onClick={() => {
                        setSelectedQuestion(
                            residencyQuestions[pageIndex - 1].question._id
                          );
                        setPageIndex(pageIndex - 1);
                      }}
                    >
                      <BiSolidLeftArrow />
                    </div>

                    <div
                      className={`h-20 bg-teal-500 rounded-xl cursor-pointer
                  shadow-lg p-4 justify-start items-center m-4 
                  text-lg font-black ${
                    pageIndex < residencyQuestions.length - 1
                      ? "flex"
                      : "hidden"
                  }
                transition-all duration-300 text-left`}
                      onClick={() => {
                        setSelectedQuestion(
                          residencyQuestions[pageIndex + 1].question._id
                        );
                        setPageIndex(pageIndex + 1);
                      }}
                    >
                      <BiSolidRightArrow />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-grow-1 overflow-y-auto flex-1 h-full">
                  <div className="h-full flex justify-center items-center">
                    aucune question sélectionnée
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
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
              residencyQuestions[pageIndex].note = undefined;
              setResidencyQuestions([...residencyQuestions]);
              showSnackbar("Note supprimée", 3000, SnackbarType.SUCCESS);
            } else {
              onUpdateQuestionNote(selectedNote?._id, text);
              residencyQuestions[pageIndex].note.note = text;
              setResidencyQuestions([...residencyQuestions]);
              showSnackbar("Note modifiée", 3000, SnackbarType.SUCCESS);
            }
          } else {
            const res = await onCreateResidencyQuestionNote(
              residencyQuestions[pageIndex].question._id,
              text
            );
            residencyQuestions[pageIndex].note = res.data;
            setResidencyQuestions([...residencyQuestions]);
            showSnackbar("Note ajoutée", 3000, SnackbarType.SUCCESS);
          }
          setSelectedNote(null);
        }}
      />
    </div>
  );
};

export default Residency;
