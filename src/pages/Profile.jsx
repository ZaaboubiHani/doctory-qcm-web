import React, { useContext, useState, useEffect } from "react";
import BgImg from "../assets/bg-1.jpg";
import DoctorSideImg from "../assets/doctor.png";
import TextField from "../components/TextField";
import ClipLoader from "react-spinners/ClipLoader";
import { SnackbarContext, SnackbarType } from "../contexts/SnackbarContext";
import { AuthContext } from "../contexts/AuthContext";
import Button from "../components/Button";
import { MdOutlinePhoneAndroid } from "react-icons/md";
import { BiLogOut } from "react-icons/bi";
import { Link } from "react-router-dom";
import { MdOutlinePhone } from "react-icons/md";
import { FaRegUser } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import { IoMdSave } from "react-icons/io";
import { ExamContext } from "../contexts/ExamContext";
import { IoStatsChartSharp } from "react-icons/io5";
import { FaArrowAltCircleLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import WingsImg from "../assets/wings.png";
import Api from "../api/api.source";
import { VersionContext } from "../contexts/VersionContext";

const apiInstance = Api.instance;

const Profile = ({ setToken }) => {
  const navigate = useNavigate();
  const { updateUserInfo, setCurrentUser, getMe, currentUser, getDeviceId } =
    useContext(AuthContext);
  const { version, setVersion, getLatestVersion } = useContext(VersionContext);

  const { showSnackbar } = useContext(SnackbarContext);

  const [isLoading, setIsLoading] = useState(true);
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    initData();
  }, []);

  const initData = async () => {
    setIsLoading(true);
    var verRes = await getLatestVersion();

    setVersion(verRes.data.data);
    if (currentUser) {
      setName(currentUser.name);
      setPhoneNumber(currentUser.phoneNumber);
      setIsLoading(false);
    } else {
      const token = localStorage.getItem("token");
      const userRes = await getMe(token);
      setCurrentUser(userRes.data);
      setName(userRes.data.name);
      setPhoneNumber(userRes.data.phoneNumber);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full justify-center items-center md:items-start overflow-hidden relative">
      <img
        className="absolute -right-32 -z-10 w-full h-full object-cover"
        src={DoctorSideImg}
        alt=""
      />
      {/* <img className="absolute left-0 opacity-20 -z-10" src={WingsImg} alt="" /> */}

      {isLoading ? (
        <div className="flex flex-col justify-evenly items-center w-full">
          <ClipLoader
            color={"#09BAB0"}
            loading={true}
            size={50}
            aria-label="Loading Spinner"
          />
        </div>
      ) : (
        <div className="h-[500px] w-[350px] flex flex-col justify-evenly md:ml-64 ">
          <div className={`h-[410px]  flex-col justify-evenly md:flex`}>
            <div className="relative w-full">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500">
                <FaRegUser className="text-2xl" />
              </span>
              <input
                type="text"
                placeholder="Nom d'utilisateur"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
              />
            </div>
            <div className="relative w-full">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500">
                <MdOutlinePhone className="text-2xl" />
              </span>
              <input
                type="tel"
                placeholder="Numéro de téléphone"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
              />
            </div>

            <div className="relative w-full">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500">
                <MdOutlineEmail className="text-2xl" />
              </span>
              <input
                type="email"
                placeholder="E-mail"
                value={currentUser.email}
                readOnly
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600 cursor-not-allowed"
              />
            </div>

            <div className="h-4" />
            {/* Buttons */}
            <button
              onClick={async () => {
                const token = localStorage.getItem("token");
                const trimmedPhoneNumber = phoneNumber.trim();
                const isValidPhoneNumber = /^[0-9]+$/.test(trimmedPhoneNumber);

                if (!isValidPhoneNumber) {
                  showSnackbar(
                    "Le numéro de téléphone ne doit contenir que des numéros.",
                    5000,
                    SnackbarType.WARNING
                  );
                  return;
                } else {
                  setIsLoading(true);
                  const user = {
                    _id: currentUser._id,
                    token: token,
                    phoneNumber: trimmedPhoneNumber,
                    email: currentUser.email,
                    name: name.trim(),
                    deviceToken: getDeviceId(),
                  };
                  const response = await updateUserInfo(user);
                  setCurrentUser(user);

                  showSnackbar(
                    "informations modifiées",
                    3000,
                    SnackbarType.SUCCESS
                  );
                  setIsLoading(false);
                }
              }}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition"
            >
              <IoMdSave className="text-2xl" />
              Enregistrer
            </button>

            <button
              onClick={async () => {
                const fileUrl = version.file.url;
                const fileName = `doctory_qcm_${version.number}.apk`;

                const link = document.createElement("a");
                link.href = fileUrl;
                link.download = fileName;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition"
            >
              <MdOutlinePhoneAndroid className="text-2xl" />
              Télécharger APK
            </button>

            <button
              type="button"
              data-toggle="modal"
              data-target="#exampleModal"
              className=" w-full flex items-center justify-center gap-2 px-4 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition"
            >
              <BiLogOut className="text-2xl" />
              Déconnecter
            </button>
          </div>
        </div>
      )}
      <div class="flex justify-center">
        <div
          class="fixed inset-0 bg-slate-950/50 flex justify-center items-center opacity-0 pointer-events-none transition-opacity duration-300 ease-out z-[9999]"
          id="exampleModal"
          aria-hidden="true"
        >
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl shadow-slate-950/5 border border-slate-200 dark:border-slate-500 scale-95">
            <div class="p-4 pb-2 flex justify-between items-center">
              <h1 class="text-lg text-slate-800 dark:text-slate-100 font-semibold">
                Êtes-vous sûr de vouloir vous déconnecter?
              </h1>
            </div>

            <div class="p-4 flex justify-around gap-2">
              <Link to="/" >
                <button
                  type="button"
                  data-dismiss="modal"
                  class="inline-flex items-center justify-center border align-middle 
                select-none font-sans font-medium text-center transition-all duration-300 ease-in 
                disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed data-[shape=pill]:rounded-full 
                data-[width=full]:w-full focus:shadow-none text-sm rounded-md py-2 px-4 bg-transparent border-transparent 
                text-red-500 hover:bg-red-500/10 hover:border-red-500/10 shadow-none hover:shadow-none outline-none"
                  onClick={() => {
                    setIsLoading(true);
                    localStorage.clear();
                    currentUser.deviceToken = null;
                    updateUserInfo(currentUser);
                    setToken(undefined);
                    setIsLoading(false);
                  }}
                >
                  Oui
                </button>
              </Link>
              <button
                type="button"
                data-dismiss="modal"
                class="inline-flex items-center justify-center border align-middle 
                select-none font-sans font-medium text-center transition-all duration-300 ease-in 
                disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed data-[shape=pill]:rounded-full 
                data-[width=full]:w-full focus:shadow-none text-sm rounded-md py-2 px-4 bg-transparent border-transparent 
                text-green-500 hover:bg-green-500/10 hover:border-green-500/10 shadow-none hover:shadow-none outline-none"
              >
                Non
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
