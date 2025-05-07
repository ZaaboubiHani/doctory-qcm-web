import React, { useContext, useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import BgImg from "../assets/bg-1.jpg";
import moduleImg from "../assets/cube-3d.png";
import courseImg from "../assets/des-documents.png";
import { CoursesContext } from "../contexts/CoursesContext";
import { ModulesContext } from "../contexts/ModulesContext";
import ClipLoader from "react-spinners/ClipLoader";
import { SnackbarContext, SnackbarType } from "../contexts/SnackbarContext";
import { ExamContext } from "../contexts/ExamContext";
import { StatsContext } from "../contexts/StatsContext";
import { useNavigate } from "react-router-dom";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { FaArrowAltCircleLeft } from "react-icons/fa";
import WingsImg from "../assets/wings.png";

const Stats = () => {
  const navigate = useNavigate();

  const { showSnackbar } = useContext(SnackbarContext);
  const {
    categoriesStats,
    setCategoriesStats,
    getAllCategoriesStats,
    selectedCategory,
    setSelectedCategory,
    modulesStats,
    setModulesStats,
    getModulesStatsOfCategory,
    selectedModule,
    setSelectedModule,
    coursesStats,
    setCoursesStats,
    getCoursesStatsOfModule,
  } = useContext(StatsContext);

  const [isLoading, setIsLoading] = useState(true);
  const [loadingModulesStats, setLoadingModulesStats] = useState(false);
  const [loadingCoursesStats, setLoadingCoursesStats] = useState(false);

  useEffect(() => {
    initData();
  }, []);

  const initData = async () => {
    setIsLoading(true);
    if (localStorage.getItem("year") === "Residency") {

      const response = await getAllCategoriesStats();
      setCategoriesStats(response.data.data);
    } else {
      setLoadingModulesStats(true);
      setCoursesStats(undefined);
      setSelectedModule(undefined);
      const response = await getModulesStatsOfCategory(undefined);
      setModulesStats(response.data.data);
      setLoadingModulesStats(false);
    }

    setIsLoading(false);
  };

  return (
    <div className="flex flex-row h-full overflow-hidden relative">
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
        <div className="w-full h-full flex">
          <div
            className={`${localStorage.getItem("year") === "Residency" ? "w-full md:w-1/2 lg:w-1/3" : "w-0"}  h-full flex-col ${selectedCategory && selectedModule
              ? "hidden lg:flex"
              : selectedCategory && !selectedModule
                ? "hidden md:flex"
                : "flex"
              }`}
          >
            <div
              role="alert"
              class="relative flex w-full items-start rounded-b-md border bg-primary-light border-slate-200 dark:bg-primary-dark
             dark:border-slate-500 p-3 dark:text-slate-50 shadow-lg"
            >
              <div className="font-sans text-base font-bold text-center w-full">Catégories</div>


            </div>

            <div className="flex-grow-1 overflow-y-auto ">
              {categoriesStats?.map((e, index) => (
                <div
                  key={e._id}
                  onClick={async () => {
                    setSelectedCategory(e._id);
                    setLoadingModulesStats(true);
                    setCoursesStats(undefined);
                    setSelectedModule(undefined);
                    const response = await getModulesStatsOfCategory(e._id);
                    setModulesStats(response.data.data);
                    setLoadingModulesStats(false);
                  }}
                  role="alert"
                  className="p-2"
                >
                  <div
                    class={`relative flex w-full items-center rounded-md border ${e._id === selectedCategory
                      ? "bg-teal-100 dark:bg-teal-800"
                      : "bg-white dark:bg-gray-800"
                      }  border-slate-200 bg-opacity-75 transition-all duration-300
           dark:border-slate-500 hover:dark:bg-slate-700 hover:bg-slate-300 shadow-lg p-2 cursor-pointer`}
                  >
                    <img src={moduleImg} alt="" className="mr-2 h-10" />
                    <div className="flex-1">{e.name}</div>
                    <div style={{ width: 40, height: 40 }}>
                      <CircularProgressbar
                        value={e.percentage}
                        text={`${parseFloat(e.percentage.toFixed())}%`}
                        styles={buildStyles({
                          textColor: "#09BAB0",
                          pathColor: "#09BAB0",
                          trailColor: "#e0f2f1",
                          strokeWidth: 12, // default is 8, so this increases the thickness
                          textSize: "24px",
                        })}
                        strokeWidth={12} // This is also required here
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="border-l hidden md:block" />

          <div
            className={` ${localStorage.getItem("year") === "Residency" ? "w-full md:w-1/2 lg:w-1/3" : "w-full md:w-1/2"} h-full  flex-col ${localStorage.getItem("year") === "Residency" ? selectedCategory && !selectedModule ? "flex" : "hidden md:flex" : selectedModule ? "hidden md:flex" : "md:flex"
              }`}
          >
            <div
              role="alert"
              class="relative flex w-full items-start rounded-b-md border bg-primary-light border-slate-200 dark:bg-primary-dark
             dark:border-slate-500 p-3 dark:text-slate-50 shadow-lg"
            >
              <FaArrowAltCircleLeft
                className={`text-3xl min-h-8 mr-2 ${selectedModule ? "flex lg:hidden" : "md:hidden"
                  }`}
                onClick={() => {
                  if (selectedModule) {
                    setSelectedModule(undefined);
                    setCoursesStats(undefined);
                  } else {
                    setSelectedCategory(undefined);
                    setModulesStats(undefined);
                  }
                }}
              ></FaArrowAltCircleLeft>
              <div className="font-sans text-base font-bold text-center w-full">Modules</div>


            </div>

            <div className="flex-grow-1 overflow-y-auto flex-1">
              {loadingModulesStats ? (
                <div className="flex flex-col justify-evenly items-center w-full h-full">
                  <ClipLoader
                    color={"#09BAB0"}
                    loading={true}
                    size={50}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                  />
                </div>
              ) : modulesStats ? (
                modulesStats?.map((e, index) => (
                  <div
                    onClick={async () => {
                      setSelectedModule(e._id);

                      setLoadingCoursesStats(true);
                      const response = await getCoursesStatsOfModule(e._id);
                      setCoursesStats(response.data.data);
                      setLoadingCoursesStats(false);
                    }}
                    key={e._id}
                    role="alert"
                    className="p-2"
                  >
                    <div
                      class={`relative flex w-full items-center rounded-md border ${e._id === selectedModule
                        ? "bg-teal-100 dark:bg-teal-800"
                        : "bg-white dark:bg-gray-800"
                        }  border-slate-200 bg-opacity-75 transition-all duration-300
           dark:border-slate-500 hover:dark:bg-slate-700 hover:bg-slate-300 shadow-lg p-2 cursor-pointer`}
                    >
                      <img src={courseImg} className="mr-1 h-10" alt="" />
                      <div className="flex-1">{e.name}</div>
                      <div style={{ width: 40, height: 40 }}>
                        <CircularProgressbar
                          value={e.percentage}
                          text={`${parseFloat(e.percentage.toFixed())}%`}
                          styles={buildStyles({
                            textColor: "#09BAB0",
                            pathColor: "#09BAB0",
                            trailColor: "#e0f2f1",
                            strokeWidth: 12, // default is 8, so this increases the thickness
                            textSize: "24px",
                          })}
                          strokeWidth={12} // This is also required here
                        />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex-grow-1 overflow-y-auto flex-1 h-full">
                  <div className="h-full flex justify-center items-center">
                    aucune module disponible
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="border-l hidden lg:block" />
          <div
            className={`${localStorage.getItem("year") === "Residency" ? "w-full lg:w-1/3" : "w-full md:w-1/2"} h-full flex-col ${localStorage.getItem("year") === "Residency" ? selectedModule ? "flex md:w-1/2" : "hidden lg:flex" : selectedModule ? "flex md:w-1/2" : "hidden lg:flex"
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
                  setSelectedModule(undefined);
                  setCoursesStats(undefined);
                }}
              ></FaArrowAltCircleLeft>
              <div className="font-sans text-base font-bold text-center w-full">Cours</div>
            </div>

            <div className="flex-grow-1 overflow-y-auto flex-1">
              {loadingCoursesStats ? (
                <div className="flex flex-col justify-evenly items-center w-full h-full">
                  <ClipLoader
                    color={"#09BAB0"}
                    loading={true}
                    size={50}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                  />
                </div>
              ) : coursesStats ? (
                coursesStats?.map((e, index) => (
                  <div

                    key={e._id}
                    role="alert"
                    className="p-2"
                  >
                    <div
                      class={`relative flex w-full items-center rounded-md border ${e._id === selectedModule
                        ? "bg-teal-100 dark:bg-teal-800"
                        : "bg-white dark:bg-gray-800"
                        }  border-slate-200 bg-opacity-75 transition-all duration-300
           dark:border-slate-500 hover:dark:bg-slate-700 hover:bg-slate-300 shadow-lg p-2 cursor-pointer`}
                    >
                      <img src={courseImg} className="mr-1 h-10" alt="" />
                      <div className="flex-1">{e.name}</div>
                      <div style={{ width: 40, height: 40 }}>
                        <CircularProgressbar
                          value={e.percentage}
                          text={`${parseFloat(e.percentage.toFixed())}%`}
                          styles={buildStyles({
                            textColor: "#09BAB0",
                            pathColor: "#09BAB0",
                            trailColor: "#e0f2f1",
                            strokeWidth: 12, // default is 8, so this increases the thickness
                            textSize: "24px",
                          })}
                          strokeWidth={12} // This is also required here
                        />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex-grow-1 overflow-y-auto flex-1 h-full">
                  <div className="h-full flex justify-center items-center">
                    aucune cours disponible
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stats;
