import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { QuestionsContext } from "../contexts/QuestionsContext";
import { ModulesContext } from "../contexts/ModulesContext";
import { CoursesContext } from "../contexts/CoursesContext";
import { SnackbarContext, SnackbarType } from "../contexts/SnackbarContext";
import {
  FaArrowAltCircleLeft,
  FaCheckCircle,
  FaDownload,
  FaLightbulb,
} from "react-icons/fa";
import WingsImg from "../assets/wings.png";
import moduleImg from "../assets/cube-3d.png";
import courseImg from "../assets/des-documents.png";
import ClipLoader from "react-spinners/ClipLoader";

const Questions = () => {
  const { id } = useParams();
  const navigate = useNavigate();

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
    await fetchQA(id);
    setIsLoading(false);
  };

  const fetchQA = async (courseId) => {
    const resQ = await getQuestions(courseId);
    resQ.status === 200
      ? setQuestions(resQ.data.data)
      : showSnackbar(
          "N'a pas réussi à obtenir les questions",
          5000,
          SnackbarType.ERROR
        );

    const resA = await getAnswers(courseId);
    resA.status === 200
      ? setAnswers(resA.data.data)
      : showSnackbar(
          "N'a pas réussi à obtenir les réponses",
          5000,
          SnackbarType.ERROR
        );
  };

  return (
    <div className="flex flex-row h-full overflow-hidden relative">
      {/* <img
        className="absolute top-0 left-0 w-full h-full object-cover object-top blur-sm opacity-50 -z-10"
        src={WingsImg}
        alt=""
      /> */}

      <div className="w-full h-full flex">
        {/* Modules */}
        <div className="w-1/3 h-full hidden lg:flex flex-col justify-start">
          <div
            role="alert"
            className="relative flex w-full items-center rounded-b-md border bg-primary-light border-slate-200 dark:bg-primary-dark dark:border-slate-500 p-3 dark:text-slate-50 shadow-lg"
          >
            <div className="font-sans text-base font-bold text-center w-full">Modules</div>
          </div>
          <div className="flex-grow-1 overflow-y-auto">
            {modules.map((e) => (
              <div
                key={e._id}
                onClick={() => {
                  navigate(`/courses/${e._id}`);
                  setSelectedModule(e._id);
                }}
                className={`flex items-center gap-4 p-4 m-4 rounded-md border 
                                  ${
                                    e._id === selectedModule
                                      ? "bg-slate-200 dark:bg-slate-700"
                                      : "bg-white dark:bg-gray-800"
                                  } 
                                  border-slate-200 dark:border-slate-500 
                                  shadow-lg cursor-pointer hover:bg-slate-300 hover:dark:bg-slate-700 transition-all duration-300`}
              >
                <img src={moduleImg} alt="" className="w-6 h-6" />
                <span className="text-lg font-medium">{e.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Courses */}
        <div className="border-l hidden lg:block" />
        <div className="w-1/3 md:w-1/2 lg:w-1/3 h-full hidden md:flex flex-col">
          <div
            role="alert"
            className="relative flex w-full items-center rounded-b-md border bg-primary-light border-slate-200 dark:bg-primary-dark dark:border-slate-500 p-3 dark:text-slate-50 shadow-lg"
          >
            <div className="font-sans text-base font-bold text-center w-full">Cours</div>
          </div>
          <div className="flex-grow-1 overflow-y-auto">
            {courses.map((e) => (
              <div
                key={e._id}
                className="flex items-center gap-3 p-4 m-4 rounded-md border bg-white dark:bg-gray-800 border-slate-200 dark:border-slate-500 shadow-lg hover:bg-slate-300 hover:dark:bg-slate-700 cursor-pointer transition-all duration-300"
              >
                <img
                  src={courseImg}
                  className="w-6 h-6"
                  alt=""
                  onClick={() => {
                    setIsLoading(true);
                    navigate(`/questions/${e._id}`);
                    setSelectedCourse(e._id);
                    fetchQA(e._id);
                  }}
                />
                <div
                   className="flex-1 text-lg font-medium"
                  onClick={() => {
                    setIsLoading(true);
                    navigate(`/questions/${e._id}`);
                    setSelectedCourse(e._id);
                    fetchQA(e._id);
                  }}
                >
                  {e.name}
                </div>
                {e.file?.url && (
                  <FaDownload
                    onClick={() => {
                      const link = document.createElement("a");
                      link.href = e.file.url;
                      link.setAttribute("download", "");
                      link.setAttribute("target", "_blank");
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Questions */}
        <div className="border-l hidden md:block" />
        <div className="w-full md:w-1/2 lg:w-1/3 h-full flex flex-col">
          <div
            role="alert"
            className="relative flex w-full items-center rounded-b-md border bg-primary-light border-slate-200 dark:bg-primary-dark dark:border-slate-500 p-3 dark:text-slate-50 shadow-lg"
          >
            <FaArrowAltCircleLeft
              className="text-3xl min-h-8 mr-2 flex lg:hidden"
              onClick={() => navigate(-1)}
            />
            <div className="font-sans text-base font-bold text-center w-full">Questions</div>
            
          </div>
          <div className="flex-grow-1 overflow-y-auto flex flex-wrap justify-start items-start">
            {isLoading ? (
              <div className="flex flex-col justify-evenly items-center w-full h-full">
                <ClipLoader color="#09BAB0" loading={true} size={50} />
              </div>
            ) : (
              questions.map((q, index) => (
                <div
                  key={q.question?._id ?? q._id}
                  className={`w-12 h-12 md:h-16 md:w-16 bg-white dark:bg-gray-800 rounded-md border border-slate-200 
           dark:border-slate-500 cursor-pointer
             shadow-lg p-4 flex flex-col justify-center items-center m-2 text-sm
             md:text-lg lg:text-xl hover:dark:bg-slate-700 hover:bg-slate-300
             transition-all duration-300 text-center relative`}
                  onClick={() => navigate(`/quiz/${index}`)}
                >
                  <div className="absolute top-[2px] right-[2px] md:top-1 md:right-1">
                    {q.note && (
                      <FaLightbulb className="text-yellow-500 mb-1 text-xs md:text-sm" />
                    )}
                    {answers.map((a) => a.question).includes(q._id) && (
                      <FaCheckCircle className="text-green-500 text-xs md:text-sm" />
                    )}
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
