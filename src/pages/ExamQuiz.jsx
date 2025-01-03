import React, { useContext, useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import BgImg from "../assets/bg-1.jpg";
import ClipLoader from "react-spinners/ClipLoader";
import { BiSolidLeftArrow } from "react-icons/bi";
import { BiSolidRightArrow } from "react-icons/bi";
import { SnackbarContext, SnackbarType } from "../contexts/SnackbarContext";
import { useNavigate } from "react-router-dom";
import { ExamContext } from "../contexts/ExamContext";
import YesNoDialog from "../components/Yes-No-Dialog";
import MessageBox from "../components/Message-Box";
import WingsImg from "../assets/wings.png";

const ExamQuiz = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { showSnackbar } = useContext(SnackbarContext);

  const { examQuestions, setExamQuestions, getGeneratedModuleExam } =
    useContext(ExamContext);

  const [isLoading, setIsLoading] = useState(true);
  const [submitDialogIsOpen, setSubmitDialogIsOpen] = useState(false);
  const [resultDialogIsOpen, setResultDialogIsOpen] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [result, setResult] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0); // Time in seconds
  const timerInterval = useRef(null);

  useEffect(() => {
    timerInterval.current = setInterval(() => {
      setTimeElapsed((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timerInterval.current); // Cleanup on unmount
  }, []);

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
        if (examQuestions[pageIndex].evaluated) {
          examQuestions[pageIndex].evaluated = false;
          setExamQuestions([...examQuestions]);
        } else {
          examQuestions[pageIndex].evaluated = true;
          setExamQuestions([...examQuestions]);
        }
      } else if (event.key === "ArrowLeft") {
        if (pageIndex > 0) {
          setPageIndex(pageIndex - 1);
        }
      } else if (event.key === "ArrowRight") {
        if (pageIndex < examQuestions.length - 1) {
          setPageIndex(pageIndex + 1);
        }
      } else {
        // Handle checkbox toggling
        Object.entries(keyMap).forEach(([index, keys]) => {
          if (keys.includes(event.key)) {
            
            if (!examQuestions[pageIndex].selectedChoices) {
              examQuestions[pageIndex].selectedChoices = [];
            }

            if (
              examQuestions[pageIndex].selectedChoices.includes(
                examQuestions[pageIndex].choices[index].letter
              )
            ) {
              // Remove c.letter if it exists
              examQuestions[pageIndex].selectedChoices =
                examQuestions[pageIndex].selectedChoices.filter(
                  (choice) => choice !== examQuestions[pageIndex].choices[index].letter
                );
            } else {
              // Add c.letter if it doesn't exist
              examQuestions[pageIndex].selectedChoices = [
                ...examQuestions[pageIndex].selectedChoices,
                examQuestions[pageIndex].choices[index].letter,
              ];
            }

            // Update the state with the modified array
            setExamQuestions([...examQuestions]);
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
  }, [pageIndex, examQuestions.length,examQuestions]);

  useEffect(() => {
    initData();
  }, []);

  const initData = async () => {
    setIsLoading(true);
    const response = await getGeneratedModuleExam(id);
    setExamQuestions(response.data);
    setPageIndex(parseInt(0));
    setIsLoading(false);
  };
  const formatTime = (seconds) => {
    const hours = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${hours}:${minutes}:${secs}`;
  };

  return (
    <div className="flex flex-row h-full overflow-hidden relative">
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
          <div className="w-full flex justify-center flex-col">
            <div className="w-full h-full flex flex-col items-center overflow-auto  ">
              <div className="w-full flex justify-center mt-4">
                <p className="text-lg font-bold">
                  Temps écoulé: {formatTime(timeElapsed)}
                </p>
              </div>
              <div
                className={`h-fit max-w-[600px] bg-white rounded-xl cursor-pointer
                shadow-lg p-4 flex justify-start items-center m-4 
                text-lg font-black 
                transition-all duration-300 text-left`}
              >
                {pageIndex + 1}
                {") " + examQuestions[pageIndex].text}
              </div>
              <div>
                {examQuestions[pageIndex].choices.map((c, i) => (
                  <div className="flex items-center justify-start" key={i}>
                    <input
                      type="checkbox"
                      className="min-w-6 min-h-6 ml-2 
                    border-2 border-gray-400 
                    checked:bg-teal-500 checked:border-transparent 
                    accent-teal-500 rounded-lg transition-all duration-300 
                    focus:outline-none focus:ring-2 focus:ring-teal-500"
                      onChange={() => {
                        if (!examQuestions[pageIndex].selectedChoices) {
                          examQuestions[pageIndex].selectedChoices = [];
                        }

                        if (
                          examQuestions[pageIndex].selectedChoices.includes(
                            c.letter
                          )
                        ) {
                          // Remove c.letter if it exists
                          examQuestions[pageIndex].selectedChoices =
                            examQuestions[pageIndex].selectedChoices.filter(
                              (choice) => choice !== c.letter
                            );
                        } else {
                          // Add c.letter if it doesn't exist
                          examQuestions[pageIndex].selectedChoices = [
                            ...examQuestions[pageIndex].selectedChoices,
                            c.letter,
                          ];
                        }

                        // Update the state with the modified array
                        setExamQuestions([...examQuestions]);
                      }}
                      checked={examQuestions[
                        pageIndex
                      ].selectedChoices?.includes(c.letter)}
                    />
                    <div
                      className={`max-w-96 w-full bg-white rounded-xl cursor-pointer
                      shadow-lg p-4 flex justify-start items-start m-2
                      text-md ${
                        examQuestions[pageIndex].evaluated
                          ? examQuestions[pageIndex].correctAnswers.includes(
                              c.letter
                            )
                            ? "border-2 border-green-500"
                            : "border-2 border-red-500"
                          : "border-0"
                      }
                        transition-all duration-300 text-left`}
                      onClick={() => {
                        if (!examQuestions[pageIndex].selectedChoices) {
                          examQuestions[pageIndex].selectedChoices = [];
                        }

                        if (
                          examQuestions[pageIndex].selectedChoices.includes(
                            c.letter
                          )
                        ) {
                          // Remove c.letter if it exists
                          examQuestions[pageIndex].selectedChoices =
                            examQuestions[pageIndex].selectedChoices.filter(
                              (choice) => choice !== c.letter
                            );
                        } else {
                          // Add c.letter if it doesn't exist
                          examQuestions[pageIndex].selectedChoices = [
                            ...examQuestions[pageIndex].selectedChoices,
                            c.letter,
                          ];
                        }

                        // Update the state with the modified array
                        setExamQuestions([...examQuestions]);
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
                  examQuestions[pageIndex].evaluated = true;
                  setExamQuestions([...examQuestions]);
                }}
              >
                évaluer
              </div>
              {pageIndex === examQuestions.length - 1 ? (
                <div
                  className={`h-20 bg-teal-500 rounded-xl cursor-pointer
                  shadow-lg p-4 flex justify-start items-center m-4 
                  text-lg font-black hover:text-xl lg:hover:text-2xl
                  transition-all duration-300 text-left`}
                  onClick={async () => {
                    setSubmitDialogIsOpen(true);
                  }}
                >
                  Soumettre le résultat
                </div>
              ) : null}
              <div
                className={`h-20 bg-teal-500 rounded-xl cursor-pointer
                  shadow-lg p-4 justify-start items-center m-4 
                  text-lg font-black ${
                    pageIndex < examQuestions.length - 1 ? "flex" : "hidden"
                  }
                transition-all duration-300 text-left`}
                onClick={() => {
                  setPageIndex(pageIndex + 1);
                }}
              >
                <BiSolidRightArrow />
              </div>
            </div>
          </div>
        )}
        <div className="border-l hidden md:block" />
        <div className="md:w-1/2 lg:w-1/2 hidden md:flex h-full flex-col">
          <div className="flex-grow-1 overflow-y-auto flex flex-wrap justify-start items-start">
            {examQuestions.map((e, index) => (
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
                  setPageIndex(parseInt(index));
                }}
              >
                {index + 1}
              </div>
            ))}
          </div>
        </div>

        <YesNoDialog
          text="Êtes-vous sûr de vouloir soumettre le résultat?"
          isOpen={submitDialogIsOpen}
          onYes={() => {
            clearInterval(timerInterval.current); // Stop the timer
            let score = 0;

            examQuestions.forEach((question) => {
              const selectedChoices = question.selectedChoices || [];
              const correctChoices = question.correctAnswers || [];

              // Check if arrays are equal
              const arraysEqual =
                selectedChoices.length === correctChoices.length &&
                selectedChoices.every((value) =>
                  correctChoices.includes(value)
                );

              if (arraysEqual) {
                score += 1; // Increment the score if the arrays are equal
              }
            });
            setResult(score);
            setResultDialogIsOpen(true);
          }}
          onNo={() => {}}
          onClose={() => {
            setSubmitDialogIsOpen(false);
          }}
        />
        <MessageBox
          text={`Résultat note: ${result}/40 temps: ${formatTime(timeElapsed)}`}
          isOpen={resultDialogIsOpen}
          onOk={() => {
            navigate(-1);
          }}
          onClose={() => {
            setSubmitDialogIsOpen(false);
          }}
        />
      </div>
    </div>
  );
};

export default ExamQuiz;
