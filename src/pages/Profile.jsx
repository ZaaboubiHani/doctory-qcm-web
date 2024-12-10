import React, { useContext, useState, useEffect } from "react";
import BgImg from "../assets/bg-1.jpg";
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
import Api from "../api/api.source";
const apiInstance = Api.instance;

const Profile = ({ setToken }) => {
  const navigate = useNavigate();
  const { updateUserInfo, setCurrentUser, getMe, currentUser } =
    useContext(AuthContext);
  const { showSnackbar } = useContext(SnackbarContext);

  const [isLoading, setIsLoading] = useState(true);
  const [showStats, setShowStats] = useState(false);
  const [loadingStats, setLoadingStats] = useState(true);
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const {
    simulations,
    setSimulations,
    getRisidantStats,
    getSingleRisidantStats,
  } = useContext(ExamContext);

  useEffect(() => {
    initData();
  }, []);

  const initData = async () => {
    setIsLoading(true);
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
  const handleGetStats = async () => {
    setLoadingStats(true);
    var response = await getRisidantStats();
    setSimulations(response.data);
    setLoadingStats(false);
  };

  return (
    <div className="flex-grow-1 flex flex-row flex-wrap h-full justify-evenly items-center overflow-auto relative ">
      <img
        className="fixed w-full h-full -z-10 opacity-50 object-cover"
        src={BgImg}
        alt=""
      />
      {isLoading ? (
        <div className="flex flex-col justify-evenly items-center">
          <ClipLoader
            color={"#09BAB0"}
            loading={true}
            size={50}
            aria-label="Loading Spinner"
          />
        </div>
      ) : (
        <div className="flex h-full w-full items-center justify-evenly">
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
              icon={<IoStatsChartSharp className="text-3xl" />}
              text="Statistiques Résidanat"
              onClick={() => {
                setShowStats(!showStats);
                handleGetStats();
              }}
            />
            <Button
              icon={<MdOutlinePhoneAndroid className="text-3xl" />}
              text="Télécharger APK"
              onClick={async () => {
                console.log("get apk");

                const response = await apiInstance
                  .getAxios()
                  .get(`/downloads`, {
                    responseType: "blob",
                  });

                const url = window.URL.createObjectURL(
                  new Blob([response.data])
                );
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", "dctory_qcm_1.2.5.apk");
                document.body.appendChild(link);
                link.click();
                link.remove();
              }}
            />
            <Link to="/">
              <Button
                icon={<BiLogOut className="text-3xl" />}
                text="Déconnecter"
                onClick={() => {
                  localStorage.clear();
                  setToken(undefined);
                }}
              />
            </Link>
          </div>
          {showStats ? (
            <>
              <div className="border-l hidden md:block h-full" />
              <FaArrowAltCircleLeft
                className="text-3xl min-h-8 absolute md:hidden left-4 top-4"
                onClick={() => {
                  setShowStats(!showStats);
                }}
              ></FaArrowAltCircleLeft>
              {loadingStats ? (
                <div className="flex flex-col justify-evenly items-center">
                  <ClipLoader
                    color={"#09BAB0"}
                    loading={true}
                    size={50}
                    aria-label="Loading Spinner"
                  />
                </div>
              ) : simulations.length > 0 ? (
                <div className="h-full overflow-scroll">
                  {simulations.map((sim, index) => (
                    <div
                    key={sim._id}
                      className="w-[250px] flex items-center justify-between h-10 bg-white px-4 m-4 rounded-xl shadow-xl"
                      onClick={() => {
                        navigate(`/simulation-details/${sim._id}`);
                      }}
                    >
                      <div>{index + 1}</div>
                      <div>
                        {new Date(sim.updatedAt).getDay() + 1}-
                        {new Date(sim.updatedAt).getMonth() + 1}-
                        {new Date(sim.updatedAt).getFullYear()}
                      </div>
                      <div>{sim.timeSpent ?? "00:00:00"}</div>
                      <div>{sim.score ?? "0"}/150</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div>Aucune simulation n’a été trouvée</div>
              )}
            </>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default Profile;
