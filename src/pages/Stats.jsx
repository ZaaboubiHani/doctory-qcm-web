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
    const response = await getAllCategoriesStats();
    setCategoriesStats(response.data);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-row h-full overflow-hidden relative">
      <img
        className="absolute w-full -z-10 opacity-50 h-full object-cover"
        src={BgImg}
        alt=""
      />
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
            className={`w-full md:w-1/2 lg:w-1/3 h-full flex-col ${
              selectedCategory && selectedModule
                ? "hidden lg:flex"
                : selectedCategory && !selectedModule
                ? "hidden md:flex"
                : "flex"
            }`}
          >
            <div
              className="min-h-20 flex-shrink shadow-lg bg-teal-500 
              text-xl font-black flex justify-center items-center"
            >
              Catégories
            </div>
            <div className="flex-grow-1 overflow-y-auto ">
              {categoriesStats.map((e, index) => (
                <div
                  key={e._id}
                  onClick={async () => {
                    setSelectedCategory(e._id);
                    setLoadingModulesStats(true);
                    const response = await getModulesStatsOfCategory(e._id);
                    setModulesStats(response.data);
                    setLoadingModulesStats(false);
                  }}
                  className={`h-20 ${
                    e._id === selectedCategory ? "bg-teal-100" : "bg-white"
                  } rounded-xl cursor-pointer
                shadow-lg p-4 flex justify-start items-center m-4 
                text-lg lg:text-xl font-black hover:text-xl lg:hover:text-2xl transition-all duration-300 text-left`}
                >
                  <img src={moduleImg} alt="" className="mr-2" />
                  <div className="flex-1">{e.name}</div>
                  <div style={{ width: 50, height: 50 }}>
                    <CircularProgressbar
                      value={e.percentage}
                      text={`${parseFloat(e.percentage.toFixed(2))}%`}
                      styles={buildStyles({
                        textColor: "#09BAB0",
                        pathColor: "#09BAB0",
                        trailColor: "#e0f2f1",
                      })}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="border-l hidden md:block" />
          <div
            className={`w-full md:w-1/2 lg:w-1/3 h-full  flex-col ${
              selectedCategory && !selectedModule ? "flex" : "hidden md:flex"
            }`}
          >
            <div
              className="min-h-20 shadow-lg flex-shrink bg-teal-500 
              text-xl font-black flex justify-center items-center px-8"
            >
              <FaArrowAltCircleLeft
                className={`text-3xl min-h-8 mr-2 ${
                  selectedModule ? "flex lg:hidden" : "md:hidden"
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
              Modules
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
                      setCoursesStats(response.data);
                      setLoadingCoursesStats(false);
                    }}
                    key={e._id}
                    className={`h-20 ${
                      e._id === selectedModule ? "bg-teal-100" : "bg-white"
                    } rounded-xl cursor-pointer text-left
                    shadow-lg p-4 flex justify-start items-center m-4 
                    text-lg lg:text-xl font-black hover:text-xl lg:hover:text-2xl transition-all duration-300`}
                  >
                    <img src={courseImg} className="mr-1" alt="" />
                    <div className="flex-1">{e.name}</div>
                    <div style={{ width: 50, height: 50 }}>
                      <CircularProgressbar
                        value={e.percentage}
                        text={`${parseFloat(e.percentage.toFixed(2))}%`}
                        styles={buildStyles({
                          textColor: "#09BAB0",
                          pathColor: "#09BAB0",
                          trailColor: "#e0f2f1",
                        })}
                      />
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
            className={`w-full lg:w-1/3 h-full flex-col ${
              selectedModule ? "flex md:w-1/2" : "hidden lg:flex"
            }`}
          >
            <div className="min-h-20 bg-teal-500 text-xl shadow-lg font-black flex justify-center items-center">
              <FaArrowAltCircleLeft
                className="text-3xl min-h-8 mr-2 md:hidden"
                onClick={() => {
                  setSelectedModule(undefined);
                  setCoursesStats(undefined);
                }}
              ></FaArrowAltCircleLeft>
              Cours
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
                    onClick={() => {
                      setSelectedModule(e._id);
                    }}
                    key={e._id}
                    className={` ${
                      e._id === selectedModule ? "bg-teal-100" : "bg-white"
                    } rounded-xl cursor-pointer text-left
                    shadow-lg p-4 flex justify-start items-center m-4 
                    text-lg lg:text-xl font-black hover:text-xl lg:hover:text-2xl transition-all duration-300`}
                  >
                    <img src={courseImg} className="mr-1" alt="" />
                    <div className="flex-1">{e.name}</div>
                    <div style={{ width: 50, height: 50 }}>
                      <CircularProgressbar
                        value={e.percentage}
                        text={`${parseFloat(e.percentage.toFixed(2))}%`}
                        styles={buildStyles({
                          textColor: "#09BAB0",
                          pathColor: "#09BAB0",
                          trailColor: "#e0f2f1",
                        })}
                      />
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
