import { useNavigate, useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { MdCategory } from "react-icons/md";
import { MdQuiz } from "react-icons/md";
import { RiHeartsFill } from "react-icons/ri";
import { FaUserCircle } from "react-icons/fa";
import { IoMdArrowDropright } from "react-icons/io";
import { FaChartArea } from "react-icons/fa";
import { FaArrowAltCircleLeft } from "react-icons/fa";
import TitleImg from "../assets/title.png";
import LogoImg from "../assets/logo.png";
import { MdOutlineDarkMode } from "react-icons/md";
import { MdOutlineLightMode } from "react-icons/md";
import { IoTimer, IoMenu, IoStatsChartSharp } from "react-icons/io5";
import { FaArrowLeft } from "react-icons/fa";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  // Function to check if a route is active
  const isActive = (path) => location.pathname === path;

  // Initialize the theme state based on localStorage or default to 'light'
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  // Update theme state whenever the theme changes
  useEffect(() => {
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
    <div>
      <div
        class={`w-full rounded-lg border shadow-sm overflow-hidden bg-white border-slate-200 dark:bg-gray-800
     dark:border-slate-500 shadow-slate-950/5 absolute lg:static z-50 transition-all h-[70px] lg:h-0 duration-300 flex`}
      >
        <div
          className={`w-20 flex flex-col lg:hidden items-center py-2 px-5 transition-all duration-300 cursor-pointer text-center text-sm ${theme === "dark"
            ? "text-gray-300 hover:text-white bg-gray-800 hover:bg-teal-700"
            : "text-gray-500 hover:text-black bg-white hover:bg-teal-100"
            }  `}
          onClick={() => setIsOpen(!isOpen)}
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
        class={`w-full rounded-lg border shadow-sm overflow-hidden  bg-white border-slate-200 dark:bg-gray-800
     dark:border-slate-500 shadow-slate-950/5 absolute lg:static h-full z-50 ${isOpen ? "max-w-[280px]" : "max-w-[0px] lg:max-w-[90px]"
          } transition-all duration-300`}
      >
        <div className="w-full flex justify-center">
          <img
            src={LogoImg}
            className="w-16 my-5 object-contain hidden lg:block"
            alt=""
          />
        </div>
        <div class="w-full h-max mt-10 rounded p-3">
          <ul class="flex flex-col gap-0.5 ">
            {[
              {
                path: localStorage.getItem("year") === "Residency" ? "/categories" : "/modules",
                icon: <MdCategory className="text-3xl dark:text-gray-100" />,
                label: "Doctory qcm",
              },
              ...(localStorage.getItem("year") === "Residency"
                ? [
                  {
                    path: "/residency",
                    icon: <MdQuiz className="text-3xl dark:text-gray-100" />,
                    label: "Sujet Résidanat",
                  },
                ]
                : []),
                ...(localStorage.getItem("year") === "Residency"
                ? [
                  {
                    path: "/simulation",
                    icon: <IoTimer className="text-3xl dark:text-gray-100" />,
                    label: "Simulation Résidanat",
                  },
                ]
                : []),
            
              {

                path: "/residency-menu",
                icon: <MdQuiz className="text-3xl dark:text-gray-100" />,
                label: "Sujet Résidanat",
              },
              {
                path: "/simulation",
                icon: <IoTimer className="text-3xl dark:text-gray-100" />,
                label: "Simulation Résidanat",
              },
              {

                path: localStorage.getItem("year") === "Residency" ? "/favorites-categories" : "/favorites-modules",

                icon: <RiHeartsFill className="text-3xl dark:text-gray-100" />,
                label: "Favoris",
              },
              {
                path: "/stats",
                icon: <FaChartArea className="text-3xl dark:text-gray-100" />,
                label: "Statistiques Qcm",
              },
              ...(localStorage.getItem("year") === "Residency"
                ? [
                  {
                    path: "/residency-stats",
                    icon: (
                      <IoStatsChartSharp className="text-3xl dark:text-gray-100" />
                    ),
                    label: "Statistiques Résidanat",
                  },
                ]
                : []),

              {
                path: "/profile",
                icon: <FaUserCircle className="text-3xl dark:text-gray-100" />,
                label: "Profil",
              },
            ].map((item) => (
              <li
                href={item.path}
                onClick={() => {
                  navigate(item.path);
                  if (window.innerWidth <= 1024) {
                    setIsOpen(!isOpen);
                  }
                }}
                type="button"
                class="flex items-center cursor-pointer py-1.5 px-2.5 w-full overflow-hidden whitespace-nowrap
               rounded-md align-middle select-none font-sans transition-all duration-300 ease-in 
               aria-disabled:opacity-50 aria-disabled:pointer-events-none bg-transparent
               
                text-slate-600 hover:text-slate-800 dark:text-gray-100 dark:hover:text-white hover:bg-slate-200 focus:bg-slate-200
                 focus:text-slate-800 dark:focus:text-white dark:data-[selected=true]:text-white dark:bg-opacity-70"
              >
                <span class="grid place-items-center shrink-0 me-2.5">
                  <div className="px-2">{item.icon}</div>
                </span>
                <div
                  className={`${isOpen ? "opacity-100" : "opacity-0"
                    } transition-all duration-300 ease-in `}
                >
                  {item.label}
                </div>
              </li>
            ))}
            <hr class="my-3 mx-2 border-slate-200" />
            <li
              href="#"
              onClick={toggleTheme}
              class="flex items-center justify-center cursor-pointer py-1.5 px-2.5 rounded-md align-middle select-none font-sans transition-all duration-300 ease-in aria-disabled:opacity-50 aria-disabled:pointer-events-none bg-transparent text-slate-600 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200 focus:bg-slate-200 focus:text-slate-800 dark:focus:text-white dark:data-[selected=true]:text-white dark:bg-opacity-70"
            >
              {theme === "dark" ? (
                <MdOutlineLightMode className="text-3xl" />
              ) : (
                <MdOutlineDarkMode className="text-3xl" />
              )}
            </li>

            <hr class="my-3 mx-2 border-slate-200" />
            <li
              href="#"
              onClick={() => {
                setIsOpen(!isOpen);
              }}
              class="flex items-center justify-center cursor-pointer py-1.5 px-2.5 rounded-md align-middle select-none font-sans transition-all duration-300 ease-in aria-disabled:opacity-50 aria-disabled:pointer-events-none bg-transparent text-slate-600 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200 focus:bg-slate-200 focus:text-slate-800 dark:focus:text-white dark:data-[selected=true]:text-white dark:bg-opacity-70"
            >
              <FaArrowLeft
                className={`text-3xl ${isOpen ? "" : "rotate-180"
                  } transition-all duration-300`}
              />
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
