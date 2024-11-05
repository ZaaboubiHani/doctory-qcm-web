import React, { useContext, useState, useEffect, useRef } from "react";
import BgImg from "../assets/bg-1.jpg";
import TextField from "../components/TextField";
import { CategoriesContext } from "../contexts/CategoriesContext";
import ClipLoader from "react-spinners/ClipLoader";
import { SnackbarContext, SnackbarType } from "../contexts/SnackbarContext";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import Button from "../components/Button";
import { MdOutlinePhoneAndroid } from "react-icons/md";
import { BiLogOut } from "react-icons/bi";
import { Link } from "react-router-dom";
import { MdOutlinePhone } from "react-icons/md";
import { FaRegUser } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";

import Api from "../api/api.source";
import { IoMdSave } from "react-icons/io";

const Profile = ({ setToken }) => {
  const { login, setCurrentUser, getMe, currentUser } = useContext(AuthContext);

  const { showSnackbar } = useContext(SnackbarContext);

  const [isLoading, setIsLoading] = useState(true);
  const [name, setName] = useState();
  const [phoneNumber, setPhoneNumber] = useState();

  useEffect(() => {
    initData();
  }, []);

  const initData = async () => {
    setIsLoading(true);
    if (currentUser) {
      setIsLoading(false);
      setName(currentUser.name);
      setPhoneNumber(currentUser.phoneNumber);
    } else {
      const token = localStorage.getItem("token");
      const userRes = await getMe(token);
      setCurrentUser(userRes.data);
      setName(userRes.data.name);
      setPhoneNumber(userRes.data.phoneNumber);
    }

    setIsLoading(false);
  };

  return (
    <div
      className="flex-grow-1 flex flex-row flex-wrap h-full 
    justify-evenly items-center overflow-auto relative py-4"
    >
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
            data-testid="loader"
          />
        </div>
      ) : (
        <div className="h-[400px] flex flex-col justify-evenly">
          <TextField
            icon={<FaRegUser className="text-3xl ml-4" />}
            placeholder="Nom d'utilisateur"
            type="text"
            text={name}
            onChange={(event) => {
              setName(event.target.value);
            }}
          />
          <TextField
            icon={<MdOutlinePhone className="text-3xl ml-4" />}
            placeholder="Numéro de téléphone"
            type="phone"
            text={phoneNumber}
            onChange={(event) => {
              setPhoneNumber(event.target.value);
            }}
          />
          <TextField
            icon={<MdOutlineEmail className="text-3xl ml-4" />}
            placeholder="E-mail"
            type="email"
            text={currentUser.email}
            onChange={(event) => {}}
          />
          <Button
            icon={<IoMdSave className="text-3xl" />}
            text="Enregistrer"
            onClick={async () => {}}
          />
          <Button
            icon={<MdOutlinePhoneAndroid className="text-3xl" />}
            text="Télécharger APK"
            onClick={async () => {
              const response = await apiInstance.getAxios().get(`/downloads`, {
                responseType: "blob",
              });

              const url = window.URL.createObjectURL(new Blob([response.data]));
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
              onClick={async () => {
                localStorage.clear();
                setToken(undefined);
              }}
            />
          </Link>
        </div>
      )}
    </div>
  );
};

export default Profile;
