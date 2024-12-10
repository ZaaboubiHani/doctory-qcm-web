import React, { useContext, useState, useEffect, useRef } from "react";
import TextLogo from "../assets/QCM.png";
import WingsImg from "../assets/wings.png";
import DoctorSideImg from "../assets/doctor.png";
import TextField from "../components/TextField";
import { MdOutlineEmail } from "react-icons/md";
import PasswordField from "../components/PasswordField";
import Button from "../components/Button";
import { MdOutlinePhoneAndroid } from "react-icons/md";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import ClipLoader from "react-spinners/ClipLoader";
import { useNavigate } from "react-router-dom";
import { SnackbarContext, SnackbarType } from "../contexts/SnackbarContext";
import { ExamContext } from "../contexts/ExamContext";
import { FaArrowAltCircleLeft } from "react-icons/fa";
import { useParams } from "react-router-dom";
import Api from "../api/api.source";
const apiInstance = Api.instance;
const SimulationDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [showQuestionDetails, setShowQuestionDetails] = useState(false);
  const [selectedSimulation, setSelectedSimulation] = useState({});
  const [selectedQuestion, setSelectedQuestion] = useState({});
  const { showSnackbar } = useContext(SnackbarContext);
  const { getSingleRisidantStats } = useContext(ExamContext);

  useEffect(() => {
    initData();
  }, []);

  const initData = async () => {
    setIsLoading(true);
    const response = await getSingleRisidantStats(id);
    setSelectedSimulation(response.data);
    console.log(response);

    setIsLoading(false);
  };

  return (
    <div className="flex-grow-1 flex flex-row flex-wrap w-full  h-full justify-evenly items-center overflow-hidden relative ">
      <img
        className="absolute -right-32 -z-10 w-full h-full object-cover"
        src={DoctorSideImg}
        alt=""
      />
      <img className="absolute left-0 opacity-20 -z-10" src={WingsImg} alt="" />
      {isLoading ? (
        <div className="flex flex-col justify-center items-center">
          <ClipLoader
            color={"#09BAB0"}
            loading={true}
            size={50}
            aria-label="Loading Spinner"
          />
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center overflow-hidden ">
          <div className={`h-full w-full md:w-1/2 overflow-scroll flex-col ${showQuestionDetails ? "hidden md:flex items-center justify-center" : "md:flex items-center justify-center"}
            `}>
            {selectedSimulation.questions.map((question, index) => {
              // Check if the arrays match
              const isCorrect =
                question.question.correctAnswers.length ===
                  question.answers.length &&
                question.question.correctAnswers.every((answer) =>
                  question.answers.includes(answer)
                );

              return (
                <div
                  key={question._id}
                  className={`w-[350px] bg-white px-4 m-4 rounded-xl shadow-xl border-2 ${
                    isCorrect ? "border-green-500" : "border-red-500"
                  }`}
                  onClick={() => {
                    setShowQuestionDetails(true);
                    setSelectedQuestion(question.question);
                  }}
                >
                  <div className="text-center w-full font-bold">
                    {question.question.category.name}
                  </div>
                  <div className="">
                    Module: {question.question.module.name}
                  </div>
                  <div className="">
                    Course: {question.question.course.name}
                  </div>
                  <div className="border-b block w-full" />
                  <div className="">Question: {question.question.text}</div>
                </div>
              );
            })}
          </div>
          {showQuestionDetails ? (
            <div className=" w-full md:w-1/2 border-l h-full ">
              <FaArrowAltCircleLeft
                className="text-3xl min-h-8 absolute md:hidden left-4 top-4"
                onClick={() => {
                  setShowQuestionDetails(false);
                }}
              ></FaArrowAltCircleLeft>
              <div
                className={`min-h-20 max-w-[600px] bg-white rounded-xl cursor-pointer
                shadow-lg p-4 flex justify-start items-center m-4 
                text-lg font-black 
                transition-all duration-300 text-left mt-10`}
              >
                
                {selectedQuestion.text}
              </div>
              <div className=" w-full h-full">
                {selectedQuestion.choices.map((c, i) => (
                  <div className="flex items-center justify-start" key={i}>
                    
                    <div
                      className={`max-w-96 bg-white rounded-xl cursor-pointer
                      shadow-lg p-4 flex justify-start items-start m-4 
                      text-lg font-black ${
                        selectedQuestion.correctAnswers.includes(
                              c.letter
                            )
                            ? "border-2 border-green-500"
                            : "border-2 border-red-500"
                          
                      }
                        transition-all duration-300 text-left`}
                     
                    >
                      {c.letter}
                      {") " + c.text}
                    </div>
                  </div>
                ))}
              </div>
            
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default SimulationDetails;
