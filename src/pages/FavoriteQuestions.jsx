import React, { useContext, useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import BgImg from "../assets/bg-1.jpg";
import moduleImg from "../assets/cube-3d.png";
import courseImg from "../assets/des-documents.png";
import { FavoritesContext } from "../contexts/FavoritesContext";
import ClipLoader from "react-spinners/ClipLoader";
import { SnackbarContext, SnackbarType } from "../contexts/SnackbarContext";
import { useNavigate } from "react-router-dom";
import { FaLightbulb } from "react-icons/fa";
import { FaCheckCircle } from "react-icons/fa";
import WingsImg from "../assets/wings.png";
import { FaArrowAltCircleLeft } from "react-icons/fa";
import { FaDownload } from "react-icons/fa";

const FavoriteQuestions = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { showSnackbar } = useContext(SnackbarContext);
  const {
    getFavoriteQuestions,
    setQuestions,
    questions,
    answers,
    setAnswers,
    getAnswers,
  } = useContext(FavoritesContext);
  const { modules, selectedModule, setSelectedModule } =
    useContext(FavoritesContext);
  const { courses, selectedCourse, setSelectedCourse } =
    useContext(FavoritesContext);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    initData();
  }, []);
  const initData = async () => {
    const response = await getFavoriteQuestions(id);
    if (response.status === 200) {
      setQuestions(response.data.data);
    } else {
      showSnackbar(
        "N'a pas réussi à obtenir les questions",
        5000,
        SnackbarType.ERROR
      );
    }
    const ansResponse = await getAnswers(id);
    if (ansResponse.status === 200) {
      setAnswers(ansResponse.data.data);
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
    const response = await getFavoriteQuestions(courseId);
    if (response.status === 200) {
      setQuestions(response.data.data);
    } else {
      showSnackbar(
        "N'a pas réussi à obtenir les questions",
        5000,
        SnackbarType.ERROR
      );
    }
    const ansResponse = await getAnswers(courseId);
    if (ansResponse.status === 200) {
      setAnswers(ansResponse.data.data);
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
        className="absolute top-0 left-0 w-full h-full object-cover object-top blur-sm opacity-50 -z-10"
        src={WingsImg}
        alt=""
      />
      <div className="w-full h-full flex">
        <div className="w-1/3 h-full hidden lg:flex flex-col justify-start">
          <div
            className="min-h-20 shadow-lg bg-teal-500 text-xl font-black 
          flex justify-center items-center rounded-b-2xl"
          >
            Modules
          </div>
          <div className="flex-grow-1 overflow-y-auto">
            {modules.map((e, index) => (
              <div
                key={e._id}
                onClick={() => {
                  navigate(`/favorites-courses/${e._id}`);
                  setSelectedModule(e._id);
                }}
                className={`h-20 ${
                  e._id === selectedModule ? "bg-teal-100" : "bg-white"
                } rounded-xl cursor-pointer
            shadow-lg p-4 flex justify-start items-center m-4 
           text-lg lg:text-xl hover:text-xl lg:hover:text-2xl
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
          justify-center items-center rounded-b-2xl"
          >
            Cours
          </div>
          <div className="flex-grow-1 overflow-y-auto">
            {courses.map((e, index) => (
              <div
                key={e._id}
                className={`h-20 ${
                  e._id === selectedCourse ? "bg-teal-100" : "bg-white"
                } rounded-xl cursor-pointer
            shadow-lg p-4 flex justify-start items-center m-4 
            text-lg lg:text-xl hover:text-xl lg:hover:text-2xl
             transition-all duration-300 text-left`}
              >
                <img
                  src={courseImg}
                  className="mr-1"
                  alt=""
                  onClick={() => {
                    setIsLoading(true);
                    navigate(`/favorites-questions/${e._id}`);
                    setSelectedCourse(e._id);
                    getData(e._id);
                  }}
                />
                <div
                  className="w-full"
                  onClick={() => {
                    setIsLoading(true);
                    navigate(`/favorites-questions/${e._id}`);
                    setSelectedCourse(e._id);
                    getData(e._id);
                  }}
                >
                  {e.name}
                </div>
                {e.file?.url && (
                  <FaDownload
                    onClick={() => {
                      const link = document.createElement("a");
                      link.href = e.file.url;
                      link.setAttribute("download", ""); // prevent opening in tab
                      link.setAttribute("target", "_blank"); // optional, won't affect download but safe
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
        <div className="border-l hidden md:block" />
        <div className="w-full md:w-1/2 lg:w-1/3 h-full flex flex-col">
          <div className="min-h-20 bg-teal-500 shadow-lg text-xl font-black flex justify-center items-center rounded-b-2xl">
            <FaArrowAltCircleLeft
              className={`text-3xl min-h-8 mr-2 flex lg:hidden`}
              onClick={() => {
                navigate(-1);
              }}
            ></FaArrowAltCircleLeft>
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
                  className="w-12 h-12 md:h-16 md:w-16 bg-white rounded-lg md:rounded-xl cursor-pointer
         shadow-lg p-4 flex flex-col justify-center items-center m-2
         border-2 border-teal-500 text-sm
         md:text-lg lg:text-xl hover:text-xl lg:hover:text-2xl 
         transition-all duration-300 text-center relative"
                  onClick={() => {
                    navigate(`/favorites-quiz/${index}`);
                  }}
                >
                  <div className="absolute top-[2px] right-[2px] md:top-1 md:right-1">
                    {e.note ? (
                      <FaLightbulb className="text-yellow-500 mb-1 text-xs md:text-sm" />
                    ) : null}
                    {answers
                      .map((a) => a.question)
                      .includes(e._id) ? (
                      <FaCheckCircle className="text-green-500 text-xs md:text-sm" />
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

export default FavoriteQuestions;
