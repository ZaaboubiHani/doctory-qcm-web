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
  const [showStats, setShowStats] = useState(false);
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
      <img className="absolute left-0 opacity-20 -z-10" src={WingsImg} alt="" />

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
        <div className="h-[500px] flex flex-col justify-evenly md:ml-64 ">
          <div
            className={`h-[410px]  flex-col justify-evenly ${
              showStats ? "hidden" : "flex"
            } md:flex`}
          >
            <TextField
              icon={<FaRegUser className="text-3xl ml-4" />}
              placeholder="Nom d'utilisateur"
              type="text"
              defaultValue={name} // Pass as defaultValue
              onChange={setName} // Update the state directly
            />
            <TextField
              icon={<MdOutlinePhone className="text-3xl ml-4" />}
              placeholder="Numéro de téléphone"
              type="phone"
              defaultValue={phoneNumber}
              onChange={setPhoneNumber}
            />
            <TextField
              icon={<MdOutlineEmail className="text-3xl ml-4" />}
              placeholder="E-mail"
              type="email"
              readOnly={true}
              defaultValue={currentUser.email} // No need to update this as often
              onChange={() => {}}
            />
            <div className="h-4" />
            {/* Buttons */}
            <Button
              icon={<IoMdSave className="text-3xl" />}
              text="Enregistrer"
              onClick={async () => {
                const token = localStorage.getItem("token");
                const trimmedPhoneNumber = phoneNumber.trim(); // Trim whitespace

                // Check if the trimmed phone number contains only numbers
                const isValidPhoneNumber = /^[0-9]+$/.test(trimmedPhoneNumber);

                if (!isValidPhoneNumber) {
                  showSnackbar(
                    "Le numéro de téléphone ne doit contenir que des numéros.",
                    5000,
                    SnackbarType.WARNING
                  );
                  return; // Stop the execution if the phone number is invalid
                } else {
                  setIsLoading(true);
                  const user = {
                    _id: currentUser._id,
                    token: token,
                    phoneNumber: phoneNumber.trim(),
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
            />

            <Button
              icon={<MdOutlinePhoneAndroid className="text-3xl" />}
              text="Télécharger APK"
              onClick={async () => {
                const fileUrl = version.file.url;
                const fileName = `doctory_qcm_${version.number}.apk`; // <-- Set your desired file name here

                const link = document.createElement("a");
                link.href = fileUrl;
                link.download = fileName; // This sets the downloaded file's name
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
            />
            <Link to="/">
              <Button
                icon={<BiLogOut className="text-3xl" />}
                text="Déconnecter"
                onClick={() => {
                  setIsLoading(true);
                  localStorage.clear();
                  currentUser.deviceToken = null;
                  updateUserInfo(currentUser);
                  setToken(undefined);
                  setIsLoading(false);
                }}
              />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
