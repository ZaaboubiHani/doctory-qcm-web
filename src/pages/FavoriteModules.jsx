import React, { useContext, useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import BgImg from "../assets/bg-1.jpg";
import moduleImg from "../assets/cube-3d.png";
import ClipLoader from "react-spinners/ClipLoader";
import { FavoritesContext } from "../contexts/FavoritesContext";
import { SnackbarContext, SnackbarType } from "../contexts/SnackbarContext";
import { useNavigate } from "react-router-dom";
import WingsImg from "../assets/wings.png";
import { FaArrowAltCircleLeft } from "react-icons/fa";
const FavoriteModules = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { showSnackbar } = useContext(SnackbarContext);
  const { getFavoriteModules, setModules, modules, setSelectedModule } =
    useContext(FavoritesContext);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    initData();
  }, []);
  
  const initData = async () => {
    const response = await getFavoriteModules(id);
    if (response.status === 200) {
      setModules(response.data);
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
         className="absolute top-0 left-0 w-full h-full object-cover object-top blur-sm opacity-50 -z-10"
         src={WingsImg}
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
          <div className="w-full md:w-1/2 lg:w-1/3 h-full flex flex-col ">
            <div className="min-h-20 shadow-lg bg-teal-500 text-xl font-black flex justify-center items-center rounded-b-2xl">
            <FaArrowAltCircleLeft
                            className={`text-3xl min-h-8 mr-2 flex lg:hidden`}
                            onClick={() => {
                              navigate(-1);
                            }}
                          ></FaArrowAltCircleLeft>
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
                  className="h-20 bg-white rounded-xl cursor-pointer shadow-lg p-4 flex justify-start 
                  items-center m-4 
                  text-lg lg:text-xl hover:text-xl lg:hover:text-2xl transition-all duration-300 text-left"
                >
                  <img src={moduleImg} alt="" />
                  {e.name}
                </div>
              ))}
            </div>
          </div>
          <div className="border-l hidden md:block" />
          <div className="w-1/3 md:w-1/2 lg:w-1/3 h-full flex-col hidden md:flex">
            <div className="min-h-20 bg-teal-500 shadow-lg text-xl font-black flex justify-center items-center rounded-b-2xl">
              Cours
            </div>
            <div className="flex-grow-1 overflow-y-auto flex-1">
              <div className="h-full flex justify-center items-center">
                aucun cours disponible
              </div>
            </div>
          </div>
          <div className="border-l hidden lg:block" />
          <div className="w-1/3 h-full hidden lg:flex flex-col">
            <div className="min-h-20 bg-teal-500 shadow-lg text-xl font-black flex justify-center items-center rounded-b-2xl">
              Questions
            </div>
            <div className="flex-grow-1 overflow-y-auto flex-1">
              <div className="h-full flex justify-center items-center">
                aucune question disponible
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FavoriteModules;
