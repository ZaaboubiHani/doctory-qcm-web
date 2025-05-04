import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ModulesContext } from "../contexts/ModulesContext";
import { SnackbarContext, SnackbarType } from "../contexts/SnackbarContext";
import ClipLoader from "react-spinners/ClipLoader";
import moduleImg from "../assets/cube-3d.png";
import WingsImg from "../assets/wings.png";
import { FaArrowAltCircleLeft } from "react-icons/fa";

const Modules = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { showSnackbar } = useContext(SnackbarContext);
  const { getModules, setModules, modules, selectedModule, setSelectedModule } =
    useContext(ModulesContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initData();
  }, []);

  const initData = async () => {
    const response = await getModules(id);
    if (response.status === 200) {
      setModules(response.data.data);
    } else {
      showSnackbar(
        "N'a pas réussi à obtenir les modules",
        5000,
        SnackbarType.ERROR
      );
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-row h-full overflow-hidden relative">
      <img
        className="absolute top-0 left-0 w-full h-full object-cover object-top blur-sm opacity-50 -z-10 dark:opacity-15"
        src={WingsImg}
        alt=""
      />
      {isLoading ? (
        <div className="flex flex-col justify-center items-center w-full h-full">
          <ClipLoader color={"#09BAB0"} loading={true} size={50} />
        </div>
      ) : (
        <div className="w-full h-full flex">
          <div className="w-full md:w-1/2 lg:w-1/3 h-full flex flex-col">
            <div
              role="alert"
              className="relative flex w-full items-center rounded-b-md border bg-primary-light border-slate-200 dark:bg-primary-dark dark:border-slate-500 p-3 dark:text-slate-50 shadow-lg"
            >
              <FaArrowAltCircleLeft
                className={`text-3xl min-h-8 mr-2 flex lg:hidden`}
                onClick={() => {
                  navigate(-1);
                }}
              ></FaArrowAltCircleLeft>
              <div className="font-sans text-base font-bold">Modules</div>
            </div>
            <div className="flex-grow overflow-y-auto">
              {modules.map((e) => (
                <div
                  key={e._id}
                  onClick={() => {
                    navigate(`/courses/${e._id}`);
                    setSelectedModule(e._id);
                  }}
                  className="flex items-center gap-4 p-4 m-4 rounded-md border border-slate-200 dark:border-slate-500 bg-white dark:bg-gray-800 hover:bg-slate-300 hover:dark:bg-slate-700 shadow-lg cursor-pointer transition-all duration-300"
                >
                  <img src={moduleImg} alt="" className="w-6 h-6" />
                  <span className="text-lg font-medium">{e.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-l hidden md:block" />
          <div className="w-1/3 md:w-1/2 lg:w-1/3 h-full flex-col hidden md:flex">
            <div
              role="alert"
              className="relative flex w-full items-center rounded-b-md border bg-primary-light border-slate-200 dark:bg-primary-dark dark:border-slate-500 p-3 dark:text-slate-50 shadow-lg"
            >
              <div className="font-sans text-base font-bold">Cours</div>
            </div>
            <div className="flex-grow overflow-y-auto flex justify-center items-center">
              aucun cours disponible
            </div>
          </div>

          <div className="border-l hidden lg:block" />
          <div className="w-1/3 h-full hidden lg:flex flex-col">
            <div
              role="alert"
              className="relative flex w-full items-center rounded-b-md border bg-primary-light border-slate-200 dark:bg-primary-dark dark:border-slate-500 p-3 dark:text-slate-50 shadow-lg"
            >
              <div className="font-sans text-base font-bold">Questions</div>
            </div>
            <div className="flex-grow overflow-y-auto flex justify-center items-center">
              aucune question disponible
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Modules;
