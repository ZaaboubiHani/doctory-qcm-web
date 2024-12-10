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

const SimulationQuiz = () => {
  const navigate = useNavigate();
  const { showSnackbar } = useContext(SnackbarContext);
  const { currentUser, setCurrentUser, getMe } = useContext(AuthContext);
  const { examQuestions, setExamQuestions, exam, setExam, submitExam, getGeneratedExam } =
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
    initData();
  }, []);

  const initData = async () => {
    setIsLoading(true);

    if (!currentUser) {
      const token = localStorage.getItem("token");
      const userRes = await getMe(token);
      setCurrentUser(userRes.data);
      const response = await getGeneratedExam(userRes.data._id);
      setExam(response.data);
      setExamQuestions(response.data.questions);
    } else {
      const response = await getGeneratedExam(currentUser._id);
      setExam(response.data);
      setExamQuestions(response.data.questions);
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
          <div className="w-full flex justify-center overflow-auto ">
            <div className="w-full h-fit flex flex-col items-center pb-32 ">
              <div className="w-full flex justify-center mt-4">
                <p className="text-lg font-bold">
                  Temps écoulé: {formatTime(timeElapsed)}
                </p>
              </div>
              <div
                className={`min-h-20 max-w-[600px] bg-white rounded-xl cursor-pointer
                shadow-lg p-4 flex justify-start items-center m-4 
                text-lg font-black 
                transition-all duration-300 text-left`}
              >
                {pageIndex + 1}
                {") " + examQuestions[pageIndex].question.text}
              </div>
              <div>
                {examQuestions[pageIndex].question.choices.map((c, i) => (
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
                      className={`max-w-96 bg-white rounded-xl cursor-pointer
                      shadow-lg p-4 flex justify-start items-start m-4 
                      text-lg font-black border-2 border-black transition-all duration-300 text-left`}
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
                }}
              >
                <BiSolidLeftArrow />
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
        <YesNoDialog
          text="Êtes-vous sûr de vouloir soumettre le résultat?"
          isOpen={submitDialogIsOpen}
          onYes={() => {
            clearInterval(timerInterval.current); // Stop the timer
            let score = 0;

            examQuestions.forEach((question) => {
              const selectedChoices = question.selectedChoices || [];
              const correctChoices = question.question.correctAnswers || [];

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
            exam.score = score;
            exam.timeSpent = formatTime(timeElapsed);
            setExam(exam);
            submitExam(exam,examQuestions);
            setResultDialogIsOpen(true);
          }}
          onNo={()=>{}}
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
