import { useNavigate, useLocation } from "react-router-dom";
import React from "react";
import { MdCategory } from "react-icons/md";
import { MdQuiz } from "react-icons/md";
import { IoTimer } from "react-icons/io5";
import { RiHeartsFill } from "react-icons/ri";
import { FaUserCircle } from "react-icons/fa";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  // Function to check if a route is active
  const isActive = (path) => location.pathname === path;

  return (
    <div className="w-screen min-h-26 lg:w-fit lg:h-screen bg-white lg:min-w-24 shadow-lg flex lg:flex-col items-center lg:pt-32">
      <div
        onClick={() => navigate("/categories")}
        className={`w-full flex flex-col items-center py-2 transition-all duration-300 cursor-pointer text-center text-sm ${
          isActive("/categories") ? "bg-teal-100" : "bg-white"
        } hover:bg-teal-100`}
      >
        <MdCategory className="text-3xl" />
        Doctory qcm
      </div>
      <div
        onClick={() => navigate("/subjects")}
        className={`w-full flex flex-col items-center py-2 transition-all duration-300 cursor-pointer text-center text-sm ${
          isActive("/subjects") ? "bg-teal-100" : "bg-white"
        } hover:bg-teal-100`}
      >
        <MdQuiz className="text-3xl" />
        Sujet Résidanat
      </div>
      <div
        onClick={() => navigate("/simulation")}
        className={`w-full flex flex-col items-center py-2 transition-all duration-300 cursor-pointer text-center text-sm ${
          isActive("/simulation") ? "bg-teal-100" : "bg-white"
        } hover:bg-teal-100`}
      >
        <IoTimer className="text-3xl" />
        Simulation
      </div>
      <div
        onClick={() => navigate("/favorites-categories")}
        className={`w-full flex flex-col items-center py-2 transition-all duration-300 cursor-pointer text-center text-sm ${
          isActive("/favorites-categories") ? "bg-teal-100" : "bg-white"
        } hover:bg-teal-100`}
      >
        <RiHeartsFill className="text-3xl" />
        Favoris
      </div>
      <div
        onClick={() => navigate("/profile")}
        className={`w-full flex flex-col items-center py-2 transition-all duration-300 cursor-pointer text-center text-sm ${
          isActive("/profile") ? "bg-teal-100" : "bg-white"
        } hover:bg-teal-100`}
      >
        <FaUserCircle className="text-3xl" />
        Profil
      </div>
    </div>
  );
}

export default Sidebar;
