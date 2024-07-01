import React, { useContext, useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import BgImg from "../assets/bg-1.jpg";
import { ModulesContext } from "../contexts/ModulesContext";
import ClipLoader from "react-spinners/ClipLoader";
import { SnackbarContext, SnackbarType } from "../contexts/SnackbarContext";
import { useNavigate } from "react-router-dom";
const Modules = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { showSnackbar } = useContext(SnackbarContext);
  const { getModules, setModules, modules } = useContext(ModulesContext);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    initData();
  }, []);
  const initData = async () => {
    const response = await getModules(id);
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
    <div className="flex flex-row h-screen overflow-hidden relative">
      <img
        className="absolute w-full -z-10 opacity-50 h-full object-cover"
        src={BgImg}
        alt=""
      />
      {isLoading ? (
        <div className="flex flex-col justify-evenly items-center w-full h-screen">
          <ClipLoader
            color={"#09BAB0"}
            loading={true}
            size={50}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      ) : (
        <div className="w-full h-screen overflow-y-auto flex justify-evenly items-center flex-wrap"
        
        >
          {modules.map((e, index) => (
            <div
              key={e._id}
              onClick={()=>{
                navigate(`/courses/${e._id}`)
              }}
              className="w-80 h-40 bg-white rounded-xl cursor-pointer
         shadow-lg p-4 flex flex-col justify-center items-center m-4 text-xl font-black hover:text-2xl transition-all duration-300 text-center"
            >
              {e.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Modules;
