import React, { useEffect } from "react";
import WingsImg from "../assets/wings.png";
import { useNavigate } from "react-router-dom";

const Simulation = () => {
  const navigate = useNavigate();

  useEffect(() => {}, []);

  return (
    <div className="flex flex-col h-screen justify-center items-center md:items-start overflow-hidden relative">
      
      {/* <img
        className="absolute -right-32 -z-10 w-full h-full object-cover"
        src={DoctorSideImg}
        alt=""
      /> */}

      <img className="absolute left-0 top-0 w-full blur-sm opacity-50 -z-10" src={WingsImg} alt="" />

      <div className="w-full h-screen flex items-center justify-center">
        <div
          className={`bg-teal-500 w-fit rounded-xl cursor-pointer
              shadow-lg p-4 flex justify-start items-center mt-4
              text-md font-black hover:text-lg
              transition-all duration-300 text-left`}
          onClick={() => {
            navigate('/simulation-quiz');
          }}
        >
          Commencez votre examen
        </div>
      </div>
    </div>
  );
};

export default Simulation;
