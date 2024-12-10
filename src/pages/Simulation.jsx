import React, { useContext, useState, useEffect, useRef } from "react";
import TextLogo from "../assets/QCM.png";
import WingsImg from "../assets/wings.png";
import DoctorSideImg from "../assets/doctor.png";
import TextField from "../components/TextField";
import { MdOutlineEmail } from "react-icons/md";
import PasswordField from "../components/PasswordField";
import Button from "../components/Button";
import { MdOutlinePhoneAndroid } from "react-icons/md";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import ClipLoader from "react-spinners/ClipLoader";
import { useNavigate } from "react-router-dom";
import { SnackbarContext, SnackbarType } from "../contexts/SnackbarContext";
import Api from "../api/api.source";
const apiInstance = Api.instance;
const Simulation = () => {
  const navigate = useNavigate();
  const { login, setCurrentUser, getMe } = useContext(AuthContext);
  const { showSnackbar } = useContext(SnackbarContext);

  useEffect(() => {}, []);

  return (
    <div className="flex flex-col h-screen justify-center items-center md:items-start overflow-hidden relative">
      <img
        className="absolute -right-32 -z-10 w-full h-full object-cover"
        src={DoctorSideImg}
        alt=""
      />
      <img className="absolute left-0 opacity-20 -z-10" src={WingsImg} alt="" />

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
