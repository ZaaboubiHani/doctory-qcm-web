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
const Login = () => {
  const navigate = useNavigate();
  const { login, setCurrentUser, getMe } = useContext(AuthContext);
  const { showSnackbar } = useContext(SnackbarContext);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [isLoading, setIsLoading] = useState(false);
  return (
    <div className="flex flex-col h-screen justify-center items-start overflow-hidden relative">
      <img
        className="absolute -right-32 -z-10 w-full h-full object-cover"
        src={DoctorSideImg}
        alt=""
      />
      <img className="absolute left-0 opacity-20 -z-10" src={WingsImg} alt="" />

      <div className="h-[500px] flex flex-col justify-evenly ml-32">
        {isLoading ? (
          <div className="flex flex-col justify-evenly items-center min-w-[300px]">
            <ClipLoader
              color={"#09BAB0"}
              loading={true}
              size={50}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          </div>
        ) : (
          <>
            <div className="flex flex-col justify-evenly items-center">
              <img className="w-[250px]" src={TextLogo} alt="" />
            </div>
            <TextField
              icon={<MdOutlineEmail className="text-3xl ml-4" />}
              placeholder="E-mail"
              type="email"
              onChange={(event) => {
                setEmail(event.target.value);
              }}
            />
            <PasswordField
              onChange={(event) => {
                setPassword(event.target.value);
              }}
            />
            <Button
              text="Se connecter"
              onClick={async () => {
                setIsLoading(true);
                try {
                  const response = await login({
                    email: email,
                    password: password,
                  });
                  if (response.status === 200) {
                    showSnackbar(response.data.message, 3000);
                    localStorage.setItem("token", response.data.token);
                    const userRes = await getMe(response.data.token);
                    console.log(userRes.data);
                    setCurrentUser(userRes.data);
                    navigate("/categories");
                  } else {
                    localStorage.clear();
                    showSnackbar(
                      "échec de l'inscription",
                      5000,
                      SnackbarType.ERROR
                    );
                  }
                } catch (error) {
                  localStorage.clear();
                  if (error.response.status !== 500) {
                    showSnackbar(
                      error.response.data.message,
                      5000,
                      SnackbarType.ERROR
                    );
                  } else {
                    showSnackbar(
                      "échec de l'inscription",
                      5000,
                      SnackbarType.ERROR
                    );
                  }
                }
                setIsLoading(false);
              }}
            />
            <Link to="/signup">
              <Button text="Insciption" />
            </Link>
            <Button
              icon={<MdOutlinePhoneAndroid className="text-3xl ml-4" />}
              text="Télécharger APK"
              onClick={async () => {
               
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
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
