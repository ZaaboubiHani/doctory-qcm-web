import React, { useContext, useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import moduleImg from "../assets/cube-3d.png";
import courseImg from "../assets/des-documents.png";
import { FavoritesContext } from "../contexts/FavoritesContext";
import ClipLoader from "react-spinners/ClipLoader";
import { SnackbarContext, SnackbarType } from "../contexts/SnackbarContext";
import { useNavigate } from "react-router-dom";
import WingsImg from "../assets/wings.png";
import { FaArrowAltCircleLeft } from "react-icons/fa";
import { FaDownload } from "react-icons/fa";

const FavoriteCourses = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { showSnackbar } = useContext(SnackbarContext);
  const { getFavoriteCourses, setCourses, courses, setSelectedCourse } =
    useContext(FavoritesContext);
  const { modules, selectedModule, setSelectedModule } =
    useContext(FavoritesContext);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    initData();
  }, []);
  const initData = async () => {
    const response = await getFavoriteCourses(id);
    if (response.status === 200) {
      setCourses(response.data.data);
    } else {
      showSnackbar(
        "N'a pas réussi à obtenir les courses",
        5000,
        SnackbarType.ERROR
      );
    }

    setIsLoading(false);
  };
  const getData = async (moduleId) => {
    const response = await getFavoriteCourses(moduleId);
    if (response.status === 200) {
      setCourses(response.data.data);
    } else {
      showSnackbar(
        "N'a pas réussi à obtenir les courses",
        5000,
        SnackbarType.ERROR
      );
    }

    setIsLoading(false);
  };

  return (
    <div className="flex flex-row h-full overflow-hidden relative">
      {/* <img
        className="absolute top-0 left-0 w-full h-full object-cover object-top blur-sm opacity-50 -z-10"
        src={WingsImg}
        alt=""
      /> */}
      <div className="w-full h-full flex">
        <div className="w-1/3 md:w-1/2 lg:w-1/3 h-full flex-col hidden md:flex">
          <div
            role="alert"
            className="relative flex w-full items-center rounded-b-md border bg-primary-light border-slate-200 dark:bg-primary-dark dark:border-slate-500 p-3 dark:text-slate-50 shadow-lg"
          >
            <div className="font-sans text-base font-bold text-center w-full">Modules</div>

            
          </div>
          <div className="flex-grow-1 overflow-y-auto ">
            {modules.map((e, index) => (
              <div
                key={e._id}
                onClick={() => {
                  setIsLoading(true);
                  navigate(`/favorites-courses/${e._id}`);
                  setSelectedModule(e._id);
                  getData(e._id);
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
        <div className="border-l hidden md:block" />
        <div className="w-full md:w-1/2 lg:w-1/3 h-full flex flex-col  ">
          <div
            role="alert"
            className="relative flex w-full items-center rounded-b-md border bg-primary-light border-slate-200 dark:bg-primary-dark dark:border-slate-500 p-3 dark:text-slate-50 shadow-lg"
          >
            <FaArrowAltCircleLeft
              className="text-2xl mr-2 cursor-pointer lg:hidden"
              onClick={() => navigate(-1)}
            />
            <div className="font-sans text-base font-bold text-center w-full">Cours</div>

            
          </div>
          <div className="flex-grow-1 overflow-y-auto flex-1">
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
              courses.map((e, index) => (
                <div
                  key={e._id}
                  className="flex items-center gap-3 p-4 m-4 rounded-md border bg-white dark:bg-gray-800 border-slate-200 dark:border-slate-500 shadow-lg hover:bg-slate-300 hover:dark:bg-slate-700 cursor-pointer transition-all duration-300"
                >
                  <img
                    src={courseImg}
                    className="w-6 h-6"
                    alt=""
                    onClick={() => {
                      navigate(`/favorites-questions/${e._id}`);
                      setSelectedCourse(e._id);
                    }}
                  />
                  <div
                    className="w-full"
                    onClick={() => {
                      navigate(`/favorites-questions/${e._id}`);
                      setSelectedCourse(e._id);
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
              ))
            )}
          </div>
        </div>
        <div className="border-l hidden lg:block" />
        <div className="w-1/3 h-full hidden lg:flex flex-col">
        <div
            role="alert"
            className="relative flex w-full items-center rounded-b-md border bg-primary-light border-slate-200 dark:bg-primary-dark dark:border-slate-500 p-3 dark:text-slate-50 shadow-lg"
          >
            <div className="font-sans text-base font-bold text-center w-full">Questions</div>
            
          </div>
          <div className="flex-grow-1 overflow-y-auto flex-1">
            <div className="h-full flex justify-center items-center">
              aucune question disponible
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FavoriteCourses;
