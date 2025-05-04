import React, { useContext, useState, useEffect, useRef } from "react";
import ToolsImg from "../assets/tools.jpg";
import TextField from "../components/TextField";
import { MdOutlineEmail } from "react-icons/md";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { MdLockOutline } from "react-icons/md";

import Button from "../components/Button";
import { FaRegUser } from "react-icons/fa";
import { MdOutlinePhone } from "react-icons/md";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { SnackbarContext, SnackbarType } from "../contexts/SnackbarContext";
import ClipLoader from "react-spinners/ClipLoader";
import { useNavigate } from "react-router-dom";
import { MdOutlineDarkMode } from "react-icons/md";
import { MdOutlineLightMode } from "react-icons/md";

const Signup = () => {
  const navigate = useNavigate();
  const { createAccount } = useContext(AuthContext);
  const { showSnackbar } = useContext(SnackbarContext);
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [phoneNumber, setPhoneNumber] = useState();
  const [isLoading, setIsLoading] = useState(false);

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

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  return (
    <div className="flex flex-col h-screen justify-center items-center md:items-start overflow-hidden relative ">
      <img
        className="absolute -z-10 w-full h-full object-cover dark:opacity-20"
        src={ToolsImg}
        alt=""
      />
      <div className="h-[400px] flex flex-col justify-evenly items-stretch md:ml-32">
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
                type="phone"
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
              onClick={async () => {
                setIsLoading(true);
                try {
                  const response = await createAccount({
                    email: email,
                    password: password,
                    phoneNumber: phoneNumber,
                    name: name,
                  });
                  if (response.status === 200) {
                    showSnackbar(response.data.message, 3000);
                    navigate("/");
                  } else {
                    showSnackbar(
                      "échec de l'inscription",
                      5000,
                      SnackbarType.ERROR
                    );
                  }
                } catch (error) {
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
            >
              Terminer
            </button>

            <Link to="/" className="w-full">
              <button className="px-4 py-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition w-full">
                Retourner
              </button>
            </Link>
            
          </div>
        )}
      </div>
    </div>
  );
};

export default Signup;
