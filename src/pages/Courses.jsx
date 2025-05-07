import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import moduleImg from "../assets/cube-3d.png";
import courseImg from "../assets/des-documents.png";
import WingsImg from "../assets/wings.png";
import ClipLoader from "react-spinners/ClipLoader";
import { FaArrowAltCircleLeft, FaDownload } from "react-icons/fa";
import { CoursesContext } from "../contexts/CoursesContext";
import { ModulesContext } from "../contexts/ModulesContext";
import { SnackbarContext, SnackbarType } from "../contexts/SnackbarContext";
import { ExamContext } from "../contexts/ExamContext";

const Courses = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { showSnackbar } = useContext(SnackbarContext);
  const { getCourses, setCourses, courses, selectedCourse, setSelectedCourse } =
    useContext(CoursesContext);
  const { getGeneratedModuleExam } = useContext(ExamContext);
  const { modules, selectedModule, setSelectedModule } = useContext(ModulesContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initData();
  }, []);

  const initData = async () => {
    const response = await getCourses(id);
    if (response.status === 200) {
      setCourses(response.data.data);
    } else {
      showSnackbar("N'a pas réussi à obtenir les cours", 5000, SnackbarType.ERROR);
    }
    setIsLoading(false);
  };

  const getData = async (moduleId) => {
    const response = await getCourses(moduleId);
    if (response.status === 200) {
      setCourses(response.data.data);
    } else {
      showSnackbar("N'a pas réussi à obtenir les cours", 5000, SnackbarType.ERROR);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-row h-full overflow-hidden relative">
      {/* <img
        className="absolute top-0 left-0 w-full h-full object-cover object-top blur-sm opacity-50 -z-10 dark:opacity-15"
        src={WingsImg}
        alt=""
      /> */}
      <div className="w-full h-full flex">
        {/* Modules Sidebar */}
        <div className="w-1/3 md:w-1/2 lg:w-1/3 h-full flex-col hidden md:flex">
          <div
            role="alert"
            className="relative flex w-full items-center rounded-b-md border bg-primary-light border-slate-200 dark:bg-primary-dark dark:border-slate-500 p-3 dark:text-slate-50 shadow-lg"
          >
            <div className="font-sans text-base font-bold text-center w-full">Modules</div>

          </div>
          <div className="flex-grow overflow-y-auto">
            {modules.map((e) => (
              <div
                key={e._id}
                onClick={() => {
                  setIsLoading(true);
                  navigate(`/courses/${e._id}`);
                  setSelectedModule(e._id);
                  getData(e._id);
                }}
                className={`flex items-center gap-4 p-4 m-4 rounded-md border 
                  ${e._id === selectedModule ? "bg-slate-200 dark:bg-slate-700" : "bg-white dark:bg-gray-800"} 
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

        {/* Courses Panel */}
        <div className="w-full md:w-1/2 lg:w-1/3 h-full flex flex-col relative">
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
          <div className="flex-grow overflow-y-auto">
            {isLoading ? (
              <div className="flex flex-col justify-center items-center w-full h-full">
                <ClipLoader color={"#09BAB0"} loading={true} size={50} />
              </div>
            ) : (
              courses.map((e) => (
                <div
                  key={e._id}
                  className="flex items-center gap-3 p-4 m-4 rounded-md border bg-white dark:bg-gray-800 border-slate-200 dark:border-slate-500 shadow-lg hover:bg-slate-300 hover:dark:bg-slate-700 cursor-pointer transition-all duration-300"
                >
                  <img
                    src={courseImg}
                    className="w-6 h-6"
                    alt=""
                    onClick={() => {
                      navigate(`/questions/${e._id}`);
                      setSelectedCourse(e._id);
                    }}
                  />
                  <div
                    className="flex-1 text-lg font-medium"
                    onClick={() => {
                      navigate(`/questions/${e._id}`);
                      setSelectedCourse(e._id);
                    }}
                  >
                    {e.name}
                  </div>
                  {e.file?.url && (
                    <FaDownload
                      className="cursor-pointer"
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
              ))
            )}
          </div>

          {/* Suggested Exam Button */}
          <div className="w-full bg-white dark:bg-gray-900 flex justify-center p-4 border-t border-slate-200 dark:border-slate-700">
            <div
              className="text-lg bg-primary-light dark:bg-primary-dark hover:bg-opacity-50 hover:dark:bg-opacity-50 text-black dark:text-white px-4 py-2 rounded-md transition-all duration-300 shadow-lg cursor-pointer"
              onClick={() => navigate(`/exam/${selectedModule}`)}
            >
              Examen suggéré
            </div>
          </div>
        </div>

        <div className="border-l hidden lg:block" />

        {/* Questions Panel */}
        <div className="w-1/3 h-full hidden lg:flex flex-col">
          <div
            role="alert"
            className="relative flex w-full items-center rounded-b-md border bg-primary-light border-slate-200 dark:bg-primary-dark dark:border-slate-500 p-3 dark:text-slate-50 shadow-lg"
          >
            <div className="font-sans text-base font-bold text-center w-full">Questions</div>

            
          </div>
          <div className="flex-grow flex justify-center items-center">
            aucune question disponible
          </div>
        </div>
      </div>
    </div>
  );
};

export default Courses;
