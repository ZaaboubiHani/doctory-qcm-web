import React, { useContext, useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import BgImg from "../assets/bg-1.jpg";
import moduleImg from "../assets/cube-3d.png";
import courseImg from "../assets/des-documents.png";
import { QuestionsContext } from "../contexts/QuestionsContext";
import { ModulesContext } from "../contexts/ModulesContext";
import { CoursesContext } from "../contexts/CoursesContext";
import ClipLoader from "react-spinners/ClipLoader";
import { SnackbarContext, SnackbarType } from "../contexts/SnackbarContext";
import { useNavigate } from "react-router-dom";
import { FaLightbulb } from "react-icons/fa";
import { FaCheckCircle } from "react-icons/fa";
const Questions = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { showSnackbar } = useContext(SnackbarContext);
  const {
    getQuestions,
    setQuestions,
    questions,
    answers,
    setAnswers,
    getAnswers,
  } = useContext(QuestionsContext);
  const { modules, selectedModule, setSelectedModule } =
    useContext(ModulesContext);
  const { courses, selectedCourse, setSelectedCourse } =
    useContext(CoursesContext);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    initData();
  }, []);
  const initData = async () => {
    const response = await getQuestions(id);
    if (response.status === 200) {
      setQuestions(response.data);
    } else {
      showSnackbar(
        "N'a pas réussi à obtenir les questions",
        5000,
        SnackbarType.ERROR
      );
    }
    const ansResponse = await getAnswers(id);
    if (ansResponse.status === 200) {
      setAnswers(ansResponse.data);
    } else {
      showSnackbar(
        "N'a pas réussi à obtenir les réponses",
        5000,
        SnackbarType.ERROR
      );
    }

    setIsLoading(false);
  };
  const getData = async (courseId) => {
    const response = await getQuestions(courseId);
    if (response.status === 200) {
      setQuestions(response.data);
    } else {
      showSnackbar(
        "N'a pas réussi à obtenir les questions",
        5000,
        SnackbarType.ERROR
      );
    }
    const ansResponse = await getAnswers(courseId);
    if (ansResponse.status === 200) {
      setAnswers(ansResponse.data);
    } else {
      showSnackbar(
        "N'a pas réussi à obtenir les réponses",
        5000,
        SnackbarType.ERROR
      );
    }

    setIsLoading(false);
  };

  return (
    <div className="flex flex-row h-full overflow-hidden relative">
      <img
        className="absolute w-full -z-10 opacity-50 h-full object-cover"
        src={BgImg}
        alt=""
      />
      <div className="w-full h-full flex">
        <div className="w-1/3 h-full hidden lg:flex flex-col justify-start">
          <div
            className="min-h-20 shadow-lg bg-teal-500 text-xl font-black 
          flex justify-center items-center"
          >
            Modules
          </div>
          <div className="flex-grow-1 overflow-y-auto">
            {modules.map((e, index) => (
              <div
                key={e._id}
                onClick={() => {
                  navigate(`/courses/${e._id}`);
                  setSelectedModule(e._id);
                }}
                className={`h-20 ${
                  e._id === selectedModule ? "bg-teal-100" : "bg-white"
                } rounded-xl cursor-pointer
            shadow-lg p-4 flex justify-start items-center m-4 
           text-lg lg:text-xl font-black hover:text-xl lg:hover:text-2xl
            transition-all duration-300 text-left`}
              >
                <img src={moduleImg} alt="" />
                {e.name}
              </div>
            ))}
          </div>
        </div>
        <div className="border-l hidden lg:block" />
        <div className="w-1/3 md:w-1/2 lg:w-1/3 h-full hidden md:flex flex-col">
          <div
            className="min-h-20 bg-teal-500 shadow-lg text-xl font-black flex 
          justify-center items-center"
          >
            Cours
          </div>
          <div className="flex-grow-1 overflow-y-auto">
            {courses.map((e, index) => (
              <div
                key={e._id}
                onClick={() => {
                  setIsLoading(true);
                  navigate(`/questions/${e._id}`);
                  setSelectedCourse(e._id);
                  getData(e._id);
                }}
                className={`h-20 ${
                  e._id === selectedCourse ? "bg-teal-100" : "bg-white"
                } rounded-xl cursor-pointer
            shadow-lg p-4 flex justify-start items-center m-4 
            text-lg lg:text-xl font-black hover:text-xl lg:hover:text-2xl
             transition-all duration-300 text-left`}
              >
                <img src={courseImg} className="mr-1" alt="" />
                {e.name}
              </div>
            ))}
          </div>
        </div>
        <div className="border-l hidden md:block" />
        <div className="w-full md:w-1/2 lg:w-1/3 h-full flex flex-col">
          <div className="min-h-20 bg-teal-500 shadow-lg text-xl font-black flex justify-center items-center">
            Questions
          </div>
          <div className="flex-grow-1 overflow-y-auto flex flex-wrap justify-start items-start">
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
              questions.map((e, index) => (
                <div
                  key={e._id}
                  className="w-20 h-20 bg-white rounded-xl cursor-pointer
         shadow-lg p-4 flex flex-col justify-center items-center m-4 
         text-lg lg:text-xl font-black hover:text-xl lg:hover:text-2xl 
         transition-all duration-300 text-center relative"
                  onClick={() => {
                    navigate(`/quiz/${index}`);
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
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Questions;
