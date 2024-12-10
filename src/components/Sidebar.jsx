import { useNavigate, useLocation } from "react-router-dom";
import React, { useState } from "react";
import { MdCategory } from "react-icons/md";
import { MdQuiz } from "react-icons/md";
import { IoTimer } from "react-icons/io5";
import { RiHeartsFill } from "react-icons/ri";
import { FaUserCircle } from "react-icons/fa";
import { IoMenu } from "react-icons/io5";
import { IoMdArrowDropright } from "react-icons/io";
import { FaChartArea } from "react-icons/fa";
import { FaArrowAltCircleLeft } from "react-icons/fa";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState();

  // Function to check if a route is active
  const isActive = (path) => location.pathname === path;

  return (
    <div className="w-full lg:w-28 lg:h-screen bg-white shadow-lg flex lg:flex-col items-start">
      <div
        className={`w-32 flex lg:hidden flex-col items-center py-2 transition-all duration-300 cursor-pointer text-center text-sm bg-white hover:bg-teal-100`}
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        <IoMenu className="text-3xl" />
      </div>
      <div
        className={`absolute z-50 bg-white h-full ${
          isOpen ? "w-full" : "w-0"
        } pt-10 lg:w-max lg:flex flex-col shadow-lg
         transition-all duration-300`}
      >
        <FaArrowAltCircleLeft className="text-3xl w-full min-h-8 mb-2 lg:hidden" onClick={()=>{
           setIsOpen(!isOpen);
        }}></FaArrowAltCircleLeft>
        <div
          onClick={() => {
            navigate("/categories");
            setIsOpen(!isOpen);
          }}
          className={`w-full min-h-16 flex lg:flex-col items-center py-2 transition-all duration-300 cursor-pointer text-center text-nowrap text-sm overflow-hidden ${
            isActive("/categories") ? "bg-teal-100" : "bg-white"
          } hover:bg-teal-100`}
        >
          <MdCategory className="text-3xl mx-2 lg:mx-0" />
          Doctory qcm
          <div className="w-full lg:hidden"></div>
          <IoMdArrowDropright className="text-3xl lg:hidden" />
        </div>
        <div
          onClick={() => {
            navigate("/residency");
            setIsOpen(!isOpen);
          }}
          className={`w-full min-h-16 flex lg:flex-col items-center py-2 transition-all duration-300 cursor-pointer text-center text-nowrap text-sm overflow-hidden ${
            isActive("/residency") ? "bg-teal-100" : "bg-white"
          } hover:bg-teal-100`}
        >
          <MdQuiz className="text-3xl mx-2 lg:mx-0" />
          Sujet Résidanat
          <div className="w-full lg:hidden"></div>
          <IoMdArrowDropright className="text-3xl lg:hidden" />
        </div>
        <div
          onClick={() => {
            navigate("/simulation");
            setIsOpen(!isOpen);
          }}
          className={`w-full min-h-16 flex lg:flex-col items-center py-2 transition-all duration-300 cursor-pointer text-center text-nowrap text-sm overflow-hidden ${
            isActive("/simulation") ? "bg-teal-100" : "bg-white"
          } hover:bg-teal-100`}
        >
          <IoTimer className="text-3xl mx-2 lg:mx-0" />
          Simulation
          <div className="w-full lg:hidden"></div>
          <IoMdArrowDropright className="text-3xl lg:hidden" />
        </div>
        <div
          onClick={() => {
            navigate("/favorites-categories");
            setIsOpen(!isOpen);
          }}
          className={`w-full min-h-16 flex lg:flex-col items-center py-2 transition-all duration-300 cursor-pointer text-center text-nowrap text-sm overflow-hidden ${
            isActive("/favorites-categories") ? "bg-teal-100" : "bg-white"
          } hover:bg-teal-100`}
        >
          <RiHeartsFill className="text-3xl mx-2 lg:mx-0" />
          Favoris
          <div className="w-full lg:hidden"></div>
          <IoMdArrowDropright className="text-3xl lg:hidden" />
        </div>
        <div
          onClick={() => {
            navigate("/stats");
            setIsOpen(!isOpen);
          }}
          className={`w-full min-h-16 flex lg:flex-col items-center py-2 transition-all duration-300 cursor-pointer text-center text-nowrap text-sm overflow-hidden ${
            isActive("/stats") ? "bg-teal-100" : "bg-white"
          } hover:bg-teal-100`}
        >
          <FaChartArea className="text-3xl mx-2 lg:mx-0" />
          Statistiques Qcm
          <div className="w-full lg:hidden"></div>
          <IoMdArrowDropright className="text-3xl lg:hidden" />
        </div>
        <div
          onClick={() => {
            navigate("/profile");
            setIsOpen(!isOpen);
          }}
          className={`w-full min-h-16 flex lg:flex-col items-center py-2 transition-all duration-300 cursor-pointer text-center text-nowrap text-sm overflow-hidden ${
            isActive("/profile") ? "bg-teal-100" : "bg-white"
          } hover:bg-teal-100`}
        >
          <FaUserCircle className="text-3xl mx-2 lg:mx-0" />
          Profil
          <div className="w-full lg:hidden"></div>
          <IoMdArrowDropright className="text-3xl lg:hidden" />
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
