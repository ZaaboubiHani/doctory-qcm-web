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
import { VersionContext } from "../contexts/VersionContext";
import ClipLoader from "react-spinners/ClipLoader";
import { useNavigate } from "react-router-dom";
import { MdLockOutline } from "react-icons/md";
import { MdOutlineDarkMode } from "react-icons/md";
import { MdOutlineLightMode } from "react-icons/md";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";

import { SnackbarContext, SnackbarType } from "../contexts/SnackbarContext";

const Login = ({ setToken }) => {
  const navigate = useNavigate();
  const { login, setCurrentUser, getMe, updateUserInfo, getDeviceId } =
    useContext(AuthContext);
  const { showSnackbar } = useContext(SnackbarContext);
  const { version, setVersion, getLatestVersion } = useContext(VersionContext);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  useEffect(() => {
    handleAutoLogin();
  }, []);

  const handleAutoLogin = async () => {
    try {
      const token = localStorage.getItem("token");
      var verRes = await getLatestVersion();

      setVersion(verRes.data.data);
      if (token) {
        const userRes = await getMe(token);

        if (
          userRes.data.data.deviceToken === null ||
          userRes.data.data.deviceToken === undefined ||
          userRes.data.data.deviceToken === ""
        ) {
          localStorage.clear();
          setToken(null);
        } else {
          const deviceId = localStorage.getItem("deviceId");
          if (userRes.data.data.deviceToken === deviceId) {
            localStorage.setItem("year", userRes.data.data.year);
            
            userRes.data.data.token = token;
            setCurrentUser(userRes.data.data);
            if(userRes.data.data.year === "Residency"){

              navigate("/categories");
            }
            else{
              navigate("/modules");

            }
          } else {
            setToken(null);
            localStorage.clear();
          }
        }
      }
      setIsLoading(false);
    } catch (error) {
      localStorage.clear();
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginClick = async () => {
    setIsLoading(true);
    try {
      const response = await login({
        email: email,
        password: password,
      });

      if (response.status === 200) {
        showSnackbar(response.data.message, 3000);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("year", response.data.data.year);
        setToken(response.data.token);
        response.data.data.deviceToken = getDeviceId();
        response.data.data.token = response.data.token;
        updateUserInfo(response.data.data);
        setCurrentUser(response.data.data);

        if(response.data.data.year === "Residency"){

          navigate("/categories");
        }
        else{
          navigate("/modules");

        }
       
      } else {
        localStorage.clear();
        showSnackbar("échec de l'inscription", 5000, SnackbarType.ERROR);
      }
    } catch (error) {
      if (error.response?.status !== 500) {
        showSnackbar(error.response?.data.message, 5000, SnackbarType.ERROR);
      } else {
        showSnackbar("échec de l'inscription", 5000, SnackbarType.ERROR);
      }
    }
    setIsLoading(false);
  };

  // Initialize the theme state based on localStorage or default to 'light'
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  // Update theme state whenever the theme changes
  useEffect(() => {
    // Set the theme class on the <html> element
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [theme]);

  // Toggle theme function
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  return (
    <div className="flex flex-col h-screen justify-center items-center md:items-start overflow-hidden relative">
      <img
        className="absolute -right-32 -z-10 w-full h-full object-cover dark:opacity-20"
        src={DoctorSideImg}
        alt=""
      />
      <img className="absolute left-0 opacity-20 -z-10" src={WingsImg} alt="" />

      <div className="h-[500px] flex flex-col justify-evenly md:ml-32">
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
          <div className="w-[350px] flex flex-col h-[550px] justify-evenly items-stretch ">
            <div className="flex flex-col justify-evenly items-center">
              <img className="w-[250px]" src={TextLogo} alt="" />
            </div>
            <div className="w-full flex justify-center">
              <button
                onClick={toggleTheme}
                className="px-4 py-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition"
              >
                {/* Conditionally render the icon based on the current theme */}
                {theme === "dark" ? (
                  <MdOutlineLightMode className="text-xl" />
                ) : (
                  <MdOutlineDarkMode className="text-xl" />
                )}
              </button>
            </div>

            <div className="relative w-full">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500">
                <MdOutlineEmail className="text-2xl" />
              </span>
              <input
                type="email"
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
              />
            </div>

            <div className="relative w-full">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500">
                <MdLockOutline className="text-2xl" />
              </span>
              <input
                type={isPasswordVisible ? "text" : "password"} // Conditionally set the input type
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500"
              >
                {isPasswordVisible ? (
                  <MdVisibilityOff className="text-2xl" />
                ) : (
                  <MdVisibility className="text-2xl" />
                )}
              </button>
            </div>

            <button
              className="px-4 py-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition"
              onClick={handleLoginClick}
            >
              Se connecter
            </button>
            <Link to="/signup" className="w-full">
              <button className="w-full px-4 py-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition">
                Inscription
              </button>
            </Link>
            <button
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
              className="inline-flex items-center justify-center text-center px-4 py-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition"
            >
              <MdOutlinePhoneAndroid className="text-xl mr-2" />
              Télécharger APK
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
