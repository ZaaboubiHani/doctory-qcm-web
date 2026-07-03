import React, { useContext, useState, useEffect, useRef } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import { SnackbarContext, SnackbarType } from "../contexts/SnackbarContext";
import { FaArrowAltCircleLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import WingsImg from "../assets/wings.png";
import { ExamContext } from "../contexts/ExamContext";

const ResidencyStats = () => {
  const navigate = useNavigate();
  const { showSnackbar } = useContext(SnackbarContext);

  const [isLoading, setIsLoading] = useState(true);
  const [loadingQuestions, setLoadingQuestions] = useState(false);

  const {
    simulations,
    setSimulations,
    getRisidantStats,
    getSingleRisidantStats,
  } = useContext(ExamContext);

  const [selectedSimulation, setSelectedSimulation] = useState();
  const [selectedQuestion, setSelectedQuestion] = useState();

  useEffect(() => {
    initData();
  }, []);

  const initData = async () => {
    setIsLoading(true);

    var response = await getRisidantStats();
    setSimulations(response.data);

    setIsLoading(false);
  };

  return (
    <div
      className="flex-grow-1 flex flex-row flex-wrap h-full 
    justify-evenly items-center overflow-hidden relative "
    >
      {/* <img
        className="absolute top-0 left-0 w-full h-full object-cover object-top blur-sm opacity-50 -z-10"
        src={WingsImg}
        alt=""
      /> */}
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
              selectedSimulation && selectedQuestion
                ? "hidden lg:flex"
                : selectedSimulation && !selectedQuestion
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
            <div
              className="min-h-8 flex-shrink mt-4
                  text-md font-black flex justify-between px-8 items-center rounded-b-2xl"
            >
              <h6>N°</h6>
              <h6>Date</h6>
              <h6>Durée(s)</h6>
              <h6>Résultat</h6>
            </div>
            <div className="flex-grow-1 overflow-y-auto ">
              {simulations.length > 0 ? (
                <div className="h-full overflow-auto">
                  {simulations.map((sim, index) => (
                    <div
                      key={sim._id}
                      className={`flex items-center justify-between h-16 ${
                        selectedSimulation?._id === sim._id
                          ? "bg-teal-300"
                          : "bg-[#ffffff88]"
                      } px-4 m-4 rounded-xl shadow-xl cursor-pointer`}
                      onClick={async () => {
                        setLoadingQuestions(true);
                        const response = await getSingleRisidantStats(sim._id);
                        setSelectedSimulation(response.data);
                        setLoadingQuestions(false);
                      }}
                    >
                      <div>{index + 1}</div>
                      <div>
                        
                        {new Date(sim.updatedAt).getDate()}-
                        {new Date(sim.updatedAt).getMonth() + 1}-
                        {new Date(sim.updatedAt).getFullYear()}
                      </div>
                      <div>{sim.timeSpent ?? "00:00:00"}</div>
                      <div>{sim.score ?? "0"}/150</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div>Aucune simulation n’a été trouvée</div>
              )}
            </div>
          </div>
          <div className="border-l hidden md:block" />
          <div
            className={`w-full md:w-1/2 lg:w-[31%] h-full  flex-col ${
              selectedSimulation && !selectedQuestion
                ? "flex"
                : "hidden md:flex"
            }`}
          >
            <div
              role="alert"
              class="relative flex w-full items-start rounded-b-md border bg-primary-light border-slate-200 dark:bg-primary-dark
             dark:border-slate-500 p-3 dark:text-slate-50 shadow-lg"
            >
              <FaArrowAltCircleLeft
                className={`text-3xl min-h-8 mr-2 cursor-pointer ${
                  selectedQuestion ? "flex lg:hidden" : "md:hidden"
                }`}
                onClick={() => {
                  setSelectedSimulation(undefined);
                  setSelectedQuestion(undefined);
                }}
              ></FaArrowAltCircleLeft>
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
              ) : selectedSimulation?.questions ? (
                selectedSimulation?.questions.map((question, index) => {
                  // Check if the arrays match
                  const isCorrect =
                    question.question.correctAnswers?.length ===
                      question.answers?.length &&
                    question.question.correctAnswers?.every((answer) =>
                      question.answers?.includes(answer)
                    );

                  return (
                    <div
                      key={question._id}
                      className={` w-full ${
                        question.question._id === selectedQuestion?._id
                          ? "bg-teal-100 dark:bg-teal-800"
                          : "bg-white dark:bg-gray-800"
                      } p-4 m-4 rounded-xl shadow-xl border cursor-pointer ${
                        isCorrect ? "border-green-500" : "border-red-500"
                      } transition-all duration-300 `}
                      onClick={() => {
                        console.log(question.question);

                        setSelectedQuestion(question.question);
                      }}
                    >
                      <div className="text-center w-full font-bold">
                        {question.question.category.name}
                      </div>
                      <div className="">
                        Module: {question.question.module?.name}
                      </div>
                      <div className="">
                        Course: {question.question.course?.name}
                      </div>
                      <div className="border-b block w-full" />
                      <div className="">Question: {question.question.text}</div>
                    </div>
                  );
                })
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
              class="relative flex w-full items-start rounded-b-md border bg-primary-light border-slate-200 dark:bg-primary-dark
             dark:border-slate-500 p-3 dark:text-slate-50 shadow-lg"
            >
              <FaArrowAltCircleLeft
                className="text-3xl min-h-8 mr-2 md:hidden"
                onClick={() => {
                  setSelectedQuestion(undefined);
                }}
              />
              <div class="m-1.5 w-full font-sans text-base leading-none font-bold">
                Details
              </div>
            </div>

            <div className="flex-grow h-full flex flex-col overflow-y-auto">
              {selectedQuestion?._id ? (
                <div className="w-full flex flex-col h-full ">
                  <div className="w-full h-full flex flex-col items-center overflow-y-auto">
                    <div
                      className="h-fit max-w-[600px] border
                      dark:border-slate-500 dark:bg-slate-800 text-black bg-slate-50 dark:text-slate-50 rounded-md
                      shadow-lg p-4 flex justify-start items-start m-4 text-lg font-black transition-all duration-300 text-left"
                    >
                      {selectedQuestion.text}
                    </div>

                    <div className="w-full">
                      {selectedQuestion.choices.map((c, i) => (
                        <div
                          className="flex items-center justify-center"
                          key={i}
                        >
                          <div
                            className={`max-w-96 w-full border
                            ${
                              selectedQuestion.correctAnswers.includes(c.letter)
                                ? " border-green-500"
                                : " border-red-500"
                            }
                   dark:bg-slate-800 text-black bg-slate-50 dark:text-slate-50 
                  rounded-md shadow-lg p-4 m-2 text-md transition-all duration-300 text-left`}
                          >
                            {c.text}
                          </div>
                        </div>
                      ))}
                    </div>
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
    </div>
  );
};

export default ResidencyStats;
