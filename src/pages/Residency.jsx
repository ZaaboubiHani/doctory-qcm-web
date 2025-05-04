import React, { useContext, useState, useEffect, useRef } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import { SnackbarContext, SnackbarType } from "../contexts/SnackbarContext";
import { ResidencyContext } from "../contexts/ResidencyContext";
import { FaArrowAltCircleLeft } from "react-icons/fa";
import { BiSolidLeftArrow } from "react-icons/bi";
import { BiSolidRightArrow } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { FaLightbulb } from "react-icons/fa";
import { FaRegLightbulb } from "react-icons/fa";
import NoteDialog from "../components/Note-Dialog";
import { NotesContext } from "../contexts/NotesContext";
import WingsImg from "../assets/wings.png";
import { FaArrowLeft } from "react-icons/fa";

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
    const handleKeyDown = (event) => {
      if (event.key === "ArrowLeft") {
        if (pageIndex > 0) {
          setSelectedQuestion(residencyQuestions[pageIndex - 1].question._id);
          setPageIndex(pageIndex - 1);
        }
      } else if (event.key === "ArrowRight") {
        if (pageIndex < residencyQuestions.length - 1) {
          setSelectedQuestion(residencyQuestions[pageIndex + 1].question._id);
          setPageIndex(pageIndex + 1);
        }
      }
    };

    // Add event listener to the document
    document.addEventListener("keydown", handleKeyDown);

    // Cleanup event listener on unmount
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [pageIndex, residencyQuestions.length]);

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
    justify-evenly items-center overflow-hidden relative "
    >
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
            className={`w-full md:w-1/2 lg:w-1/4 h-full flex-col ${
              selectedResidency && selectedQuestion
                ? "hidden lg:flex"
                : selectedResidency && !selectedQuestion
                ? "hidden md:flex"
                : "flex"
            }`}
          >
            <div
              role="alert"
              class="relative flex w-full items-start rounded-b-md border bg-primary-light border-slate-200 dark:bg-primary-dark
             dark:border-slate-500 p-3 dark:text-slate-50 shadow-lg"
            >
              <div class="m-1.5 w-full font-sans text-base leading-none font-bold">
                Résidanat
              </div>
            </div>
            <div className="flex-grow-1 overflow-y-auto ">
              {residencies.map((e, index) => (
                <div
                  key={e._id}
                  onClick={async () => {
                    setLoadingQuestions(true);
                    setSelectedQuestion(undefined);
                    setSelectedResidency(e._id);
                    const response = await getResidencyQuestionsWithDetails(
                      e._id
                    );
                    setResidencyQuestions(response.data);
                    setLoadingQuestions(false);
                  }}
                  role="alert"
                  className="p-2"
                >
                  <div
                    class={`relative flex w-full items-start rounded-md border ${
                      e._id === selectedResidency
                        ? "bg-teal-100 dark:bg-teal-800"
                        : "bg-white dark:bg-gray-800"
                    }  border-slate-200 bg-opacity-75 transition-all duration-300
             dark:border-slate-500 hover:dark:bg-slate-700 hover:bg-slate-300 shadow-lg p-4 cursor-pointer`}
                  >
                    {e.name} {new Date(e.date).getFullYear()}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="border-l hidden md:block" />
          <div
            className={`w-full md:w-1/2 lg:w-[31%] h-full  flex-col ${
              selectedResidency && !selectedQuestion ? "flex" : "hidden md:flex"
            }`}
          >
            <div
              role="alert"
              class="relative flex w-full items-center rounded-b-md border bg-primary-light border-slate-200 dark:bg-primary-dark
             dark:border-slate-500 p-3 dark:text-slate-50 shadow-lg"
            >
              <button
                onClick={() => {
                  if (selectedQuestion) {
                    setSelectedQuestion(undefined);
                  } else {
                    setSelectedResidency(undefined);
                    setResidencyQuestions([]);
                  }
                }}
                class="inline-grid min-h-[36px] min-w-[36px] select-none place-items-center rounded-md border
                 border-slate-800 dark:bg-slate-800 text-center align-middle font-sans text-sm font-bold 
                 leading-none text-black bg-slate-50 dark:text-slate-50 transition-all duration-300 ease-in hover:border-slate-700 lg:hidden
                  hover:dark:bg-slate-700 hover:bg-slate-300 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              >
                <FaArrowLeft />
              </button>

              <div class="m-1.5 w-full font-sans text-base leading-none font-bold">
                Questions
              </div>
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
                    className={`w-12 h-12 md:h-16 md:w-16 ${
                      e.question._id === selectedQuestion
                        ? "bg-teal-100 dark:bg-teal-800"
                        : "bg-white dark:bg-gray-800"
                    } rounded-md border border-slate-200 
             dark:border-slate-500 cursor-pointer
               shadow-lg p-4 flex flex-col justify-center items-center m-2 text-sm
               md:text-lg lg:text-xl hover:dark:bg-slate-700 hover:bg-slate-300
               transition-all duration-300 text-center relative`}
                    onClick={() => {
                      setSelectedQuestion(e.question._id);
                      setPageIndex(index);
                    }}
                  >
                    <div className="absolute top-[2px] right-[2px] md:top-1 md:right-1">
                      {e.note ? (
                        <FaLightbulb className="text-yellow-500 mb-1 text-xs md:text-sm" />
                      ) : null}
                    </div>
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
            className={`w-full lg:w-[44%] h-full flex flex-col ${
              selectedQuestion ? "flex md:w-1/2" : "hidden lg:flex"
            }`}
          >
            <div
              role="alert"
              class="relative flex w-full items-center rounded-b-md border bg-primary-light border-slate-200 dark:bg-primary-dark
             dark:border-slate-500 p-3 dark:text-slate-50 shadow-lg"
            >
              <button
                onClick={() => {
                  setSelectedQuestion(undefined);
                }}
                class="inline-grid min-h-[36px] min-w-[36px] select-none place-items-center rounded-md border
                 border-slate-800 dark:bg-slate-800 text-center align-middle font-sans text-sm font-bold 
                 leading-none text-black bg-slate-50 dark:text-slate-50 transition-all duration-300 ease-in hover:border-slate-700 lg:hidden
                  hover:dark:bg-slate-700 hover:bg-slate-300 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              >
                <FaArrowLeft />
              </button>

              <div class="m-1.5 w-full font-sans text-base leading-none font-bold">
                Details
              </div>
            </div>
            <div className="flex-grow h-full flex flex-col overflow-y-auto">
              {selectedQuestion ? (
                <div className="w-full flex flex-col h-full">
                  <div className="w-full h-full flex flex-col items-center overflow-y-auto">
                    <div className="flex items-center">
                      <div
                        className="h-fit max-w-[600px] border
                      dark:border-slate-500 dark:bg-slate-800 text-black bg-slate-50 dark:text-slate-50 rounded-md
                      shadow-lg p-4 flex justify-start items-start m-4 text-lg font-black transition-all duration-300 text-left"
                      >
                        {pageIndex + 1}
                        {") " + residencyQuestions[pageIndex].question.text}
                      </div>
                      <button
                        onClick={() => {
                          setSelectedQuestion(undefined);
                        }}
                        class="inline-grid min-h-[36px] min-w-[36px] select-none place-items-center rounded-md border
                 border-slate-800 dark:bg-slate-800 text-center align-middle font-sans text-sm font-bold 
                 leading-none text-black bg-slate-50 dark:text-slate-50 transition-all duration-300 ease-in hover:border-slate-700 
                  hover:dark:bg-slate-700 hover:bg-slate-300 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                      >
                        {residencyQuestions[pageIndex]?.note ? (
                          <FaLightbulb
                            className="text-yellow-500 text-xl"
                            onClick={() => {
                              setSelectedNote(
                                residencyQuestions[pageIndex].note
                              );
                              setOpenNoteDialog(true);
                            }}
                          />
                        ) : (
                          <FaRegLightbulb
                            className="text-yellow-500 text-xl "
                            onClick={() => {
                              setSelectedNote(
                                residencyQuestions[pageIndex].note
                              );
                              setOpenNoteDialog(true);
                            }}
                          />
                        )}
                      </button>
                    </div>
                    <div className="w-full">
                      {residencyQuestions[pageIndex].question.choices.map(
                        (c, i) => (
                          <div
                            className="flex items-center justify-center"
                            key={i}
                          >
                            <div
                              className="max-w-96 w-full border
                      dark:border-slate-500 dark:bg-slate-800 text-black bg-slate-50 dark:text-slate-50 rounded-md shadow-lg p-4 m-2 text-md transition-all duration-300 text-left"
                              onClick={() => {}}
                            >
                              {c.text}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                  <div
                    role="alert"
                    className="flex bottom-1 w-full justify-evenly mb-4"
                  >
                    <button
                      onClick={() => {
                        setSelectedQuestion(
                          residencyQuestions[pageIndex - 1].question._id
                        );
                        setPageIndex(pageIndex - 1);
                      }}
                      class={`inline-grid h-20 min-w-[36px] select-none place-items-center rounded-md border ${
                        pageIndex > 0 ? "flex" : "hidden"
                      }
                 dark:border-slate-800 dark:bg-teal-800 text-center align-middle font-sans text-sm font-bold 
                 leading-none text-black bg-teal-500 dark:text-slate-50 transition-all duration-300 ease-in hover:dark:border-slate-700 
                  hover:dark:bg-slate-700 hover:bg-teal-300 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none`}
                    >
                      <BiSolidLeftArrow />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedQuestion(
                          residencyQuestions[pageIndex + 1].question._id
                        );
                        setPageIndex(pageIndex + 1);
                      }}
                      class={`inline-grid h-20 min-w-[36px] select-none place-items-center rounded-md ${
                        pageIndex < residencyQuestions.length - 1
                          ? "flex"
                          : "hidden"
                      }
                  dark:bg-teal-800 text-center align-middle font-sans text-sm font-bold 
                 leading-none text-black bg-teal-500 dark:text-slate-50 transition-all duration-300 ease-in 
                  hover:dark:bg-slate-700 hover:bg-teal-300 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none`}
                    >
                      <BiSolidRightArrow />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex-grow overflow-y-auto flex justify-center items-center">
                  aucune question sélectionnée
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
