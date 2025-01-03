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
import { IoStatsChartSharp } from "react-icons/io5";
import TitleImg from "../assets/title.png";
import LogoImg from "../assets/logo.png";


function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState();

  // Function to check if a route is active
  const isActive = (path) => location.pathname === path;

  return (
    <div className="w-full lg:w-28 lg:h-screen bg-white shadow-lg flex lg:flex-col items-start">
      <div className="flex">
        <div
          className={`w-20 flex flex-col lg:hidden items-center py-2 px-5 transition-all duration-300 cursor-pointer text-center text-sm bg-white hover:bg-teal-100 text-gray-500 hover:text-black`}
          onClick={() => {
            setIsOpen(!isOpen);
          }}
        >
          <IoMenu className="text-3xl" />
          Menu
        </div>
        <img
          src={TitleImg}
          className="w-[230px] ml-9 object-contain lg:hidden"
          alt=""
        />
      </div>
      <div
        className={`absolute z-50 bg-white h-full ${
          isOpen ? "w-full" : "w-0"
        } lg:w-28 lg:flex flex-col shadow-lg
         items-center
         transition-all duration-300`}
      >
        <img
          src={LogoImg}
          className="w-16 my-5 object-contain hidden lg:block"
          alt=""
        />
          <FaArrowAltCircleLeft
            className={`text-3xl min-h-8 m-2 lg:hidden cursor-pointer ${isOpen ? "block" : "hidden"}`}
            onClick={() => {
              setIsOpen(!isOpen);
            }}
          ></FaArrowAltCircleLeft>
          
        <div
          onClick={() => {
            navigate("/categories");
            setIsOpen(!isOpen);
          }}
          className={`w-full min-h-16 flex lg:flex-col items-center p-0 lg:p-2 transition-all duration-300 cursor-pointer text-center text-nowrap lg:text-wrap text-sm overflow-hidden ${
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
          className={`w-full min-h-16 flex lg:flex-col items-center p-0 lg:p-2 transition-all duration-300 cursor-pointer text-center text-nowrap lg:text-wrap text-sm overflow-hidden ${
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
          className={`w-full min-h-16 flex lg:flex-col items-center p-0 lg:p-2 transition-all duration-300 cursor-pointer text-center text-nowrap lg:text-wrap text-sm overflow-hidden ${
            isActive("/simulation") ? "bg-teal-100" : "bg-white"
          } hover:bg-teal-100`}
        >
          <IoTimer className="text-3xl mx-2 lg:mx-0" />
          Simulation Résidanat
          <div className="w-full lg:hidden"></div>
          <IoMdArrowDropright className="text-3xl lg:hidden" />
        </div>
        <div
          onClick={() => {
            navigate("/favorites-categories");
            setIsOpen(!isOpen);
          }}
          className={`w-full min-h-16 flex lg:flex-col items-center p-0 lg:p-2 transition-all duration-300 cursor-pointer text-center text-nowrap lg:text-wrap text-sm overflow-hidden ${
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
          className={`w-full min-h-16 flex lg:flex-col items-center p-0 lg:p-2 transition-all duration-300 cursor-pointer text-center text-nowrap lg:text-wrap text-sm overflow-hidden ${
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
            navigate("/residency-stats");
            setIsOpen(!isOpen);
          }}
          className={`w-full min-h-16 flex lg:flex-col items-center p-0 lg:p-2 transition-all duration-300 cursor-pointer text-center text-nowrap lg:text-wrap text-sm overflow-hidden ${
            isActive("/residency-stats") ? "bg-teal-100" : "bg-white"
          } hover:bg-teal-100`}
        >
          <IoStatsChartSharp className="text-3xl mx-2 lg:mx-0" />
          Statistiques Résidanat
          <div className="w-full lg:hidden"></div>
          <IoMdArrowDropright className="text-3xl lg:hidden" />
        </div>
        <div
          onClick={() => {
            navigate("/profile");
            setIsOpen(!isOpen);
          }}
          className={`w-full min-h-16 flex lg:flex-col items-center p-0 lg:p-2 transition-all duration-300 cursor-pointer text-center text-nowrap lg:text-wrap text-sm overflow-hidden ${
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
