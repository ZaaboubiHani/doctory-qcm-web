import React, { useContext, useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import BgImg from "../assets/bg-1.jpg";
import ClipLoader from "react-spinners/ClipLoader";
import { BiSolidLeftArrow } from "react-icons/bi";
import { BiSolidRightArrow } from "react-icons/bi";
import { SnackbarContext, SnackbarType } from "../contexts/SnackbarContext";
import { useNavigate } from "react-router-dom";
import { ExamContext } from "../contexts/ExamContext";
import { AuthContext } from "../contexts/AuthContext";
import YesNoDialog from "../components/Yes-No-Dialog";
import MessageBox from "../components/Message-Box";
import WingsImg from "../assets/wings.png";

const SimulationQuiz = () => {
  const navigate = useNavigate();
  const { showSnackbar } = useContext(SnackbarContext);
  const { currentUser, setCurrentUser, getMe } = useContext(AuthContext);
  const {
    examQuestions,
    setExamQuestions,
    exam,
    setExam,
    submitExam,
    getGeneratedExam,
  } = useContext(ExamContext);

  const [isLoading, setIsLoading] = useState(true);
  const [submitDialogIsOpen, setSubmitDialogIsOpen] = useState(false);
  const [resultDialogIsOpen, setResultDialogIsOpen] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0); // Time in seconds
  const timerInterval = useRef(null);

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

      if (event.key === "ArrowLeft") {
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
              examQuestions[pageIndex].selectedChoices = examQuestions[
                pageIndex
              ].selectedChoices.filter(
                (choice) =>
                  choice !== examQuestions[pageIndex].choices[index].letter
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
  }, [pageIndex, examQuestions?.length, examQuestions]);

  useEffect(() => {
    timerInterval.current = setInterval(() => {
      setTimeElapsed((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timerInterval.current); // Cleanup on unmount
  }, []);

  useEffect(() => {
    initData();
  }, []);

  const initData = async () => {
    setIsLoading(true);

    if (!currentUser) {
      const token = localStorage.getItem("token");
      const userRes = await getMe(token);
      setCurrentUser(userRes.data);
      const response = await getGeneratedExam(userRes.data._id);

      setExam(response.data.data);

      setExamQuestions(response.data.data.questions);
    } else {
      const response = await getGeneratedExam(currentUser._id);

      setExam(response.data.data);
      setExamQuestions(response.data.data.questions);
    }
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
          <div className="w-full md:w-1/2 flex flex-col justify-center  ">
            <div className="w-full h-full flex flex-col items-center overflow-auto ">
              <div className="w-full flex justify-center mt-4">
                <p className="text-lg font-bold">
                  Temps écoulé: {formatTime(timeElapsed)}
                </p>
              </div>
              <div
                className="h-fit max-w-[600px] border
                      dark:border-slate-500 dark:bg-slate-800 text-black bg-slate-50 dark:text-slate-50 rounded-md
                      shadow-lg p-4 flex justify-start items-start m-4 text-lg font-black transition-all duration-300 text-left"
              >
                {pageIndex + 1}
                {") " + examQuestions[pageIndex].text}
              </div>

              <div>
                {examQuestions[pageIndex].choices.map((c, i) => (
                  <div className="flex items-center justify-start" key={i}>
                    <label
                      class="flex items-center cursor-pointer relative shadow-lg"
                      for={i}
                    >
                      <input
                        onChange={() => {
                          console.log(examQuestions[pageIndex].correctAnswers);

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
                        type="checkbox"
                        checked={examQuestions[
                          pageIndex
                        ].selectedChoices?.includes(c.letter)}
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
                      dark:border-slate-500 dark:bg-slate-800 bg-slate-50
                                               text-black  dark:text-slate-50 
                                              rounded-md shadow-lg p-4 m-2 text-md transition-all duration-300 text-left`}
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
            <div className="flex mb-4 w-full justify-evenly">
              <button
                class={`inline-grid h-20 min-w-[36px] select-none place-items-center rounded-md border ${
                  pageIndex > 0 ? "flex" : "hidden"
                }
                           dark:border-slate-800 dark:bg-teal-800 text-center align-middle font-sans text-sm font-bold 
                           leading-none text-black bg-teal-500 dark:text-slate-50 transition-all duration-300 ease-in hover:dark:border-slate-700 
                            hover:dark:bg-slate-700 hover:bg-teal-300 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none`}
                onClick={() => {
                  setPageIndex(pageIndex - 1);
                }}
              >
                <BiSolidLeftArrow />
              </button>

              {pageIndex === examQuestions.length - 1 ? (
                <div
                  class={`inline-grid h-16 min-w-[36px] select-none place-items-center rounded-md border p-4 cursor-pointer
                  dark:border-slate-800 dark:bg-teal-800 text-center align-middle font-sans text-sm font-bold 
                  leading-none text-black bg-teal-500 dark:text-slate-50 transition-all duration-300 ease-in hover:dark:border-slate-700 
                   hover:dark:bg-slate-700 hover:bg-teal-300 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none`}
                  data-toggle="modal"
                  data-target="#yesNoModal"
                >
                  Soumettre le résultat
                </div>
              ) : null}
              <button
                class={`inline-grid h-20 min-w-[36px] select-none place-items-center rounded-md border ${
                  pageIndex < examQuestions.length - 1 ? "flex" : "hidden"
                }
                         dark:border-slate-800 dark:bg-teal-800 text-center align-middle font-sans text-sm font-bold 
                         leading-none text-black bg-teal-500 dark:text-slate-50 transition-all duration-300 ease-in hover:dark:border-slate-700 
                          hover:dark:bg-slate-700 hover:bg-teal-300 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none`}
                onClick={() => {
                  setPageIndex(pageIndex + 1);
                }}
              >
                <BiSolidRightArrow />
              </button>
            </div>
          </div>
        )}
        <div className="border-l hidden md:block" />
        <div className="md:w-1/2 lg:w-1/2 hidden md:flex h-full flex-col">
          <div className="flex-grow-1 overflow-y-auto flex flex-wrap justify-start items-start">
            {examQuestions?.map((e, index) => (
              <div
                key={e._id}
                className={`w-12 h-12 md:h-16 md:w-16 ${
                  index === pageIndex
                    ? "bg-teal-100 dark:bg-teal-800"
                    : "bg-white dark:bg-gray-800"
                } rounded-md border border-slate-200 
             dark:border-slate-500 cursor-pointer
               shadow-lg p-4 flex flex-col justify-center items-center m-2 text-sm
               md:text-lg lg:text-xl hover:dark:bg-slate-700 hover:bg-slate-300
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
              // console.log();

              // Check if arrays are equal
              const arraysEqual =
                selectedChoices.length === correctChoices.length &&
                selectedChoices.every((value) =>
                  correctChoices.includes(value)
                );
              console.log(arraysEqual);

              if (arraysEqual) {
                score += 1; // Increment the score if the arrays are equal
              }
            });
            exam.score = score;
            exam.timeSpent = formatTime(timeElapsed);
            setExam(exam);
            submitExam(exam, examQuestions);
            setResultDialogIsOpen(true);
          }}
          onNo={() => {}}
          onClose={() => {
            setSubmitDialogIsOpen(false);
          }}
        />
        <MessageBox
          text={`Allez sur le profil pour vérifier votre score`}
          isOpen={resultDialogIsOpen}
          onOk={() => {
            navigate("/simulation");
          }}
          onClose={() => {
            setSubmitDialogIsOpen(false);
            navigate("/simulation");
          }}
        />
      </div>
    </div>
  );
};

export default SimulationQuiz;
