import React, { useContext, useState, useEffect, useRef } from "react";
import BgImg from "../assets/bg-1.jpg";
import ModuleImg from "../assets/module.png";
import ExamImg from "../assets/res-exam.png";
import { CategoriesContext } from "../contexts/CategoriesContext";
import ClipLoader from "react-spinners/ClipLoader";
import { SnackbarContext, SnackbarType } from "../contexts/SnackbarContext";
import { useNavigate } from "react-router-dom";
import FbImg from "../assets/fb.png";
import IgImg from "../assets/ig.png";
import TeImg from "../assets/te.png";
import CategoriesBgImg from "../assets/categories-bg.png";

const ResidencyMenu = () => {
  const navigate = useNavigate();
  const { showSnackbar } = useContext(SnackbarContext);
  const { getCategories, setCategories, categories } =
    useContext(CategoriesContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://cdn.jsdelivr.net/gh/creativetimofficial/tailwind-starter-kit@david-ui-js/dist%20/david-ui-tailwind.min.js";
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    initData();
  }, []);
  const initData = async () => {
    setIsLoading(true);
    if (categories.length === 0) {
      const response = await getCategories();
      if (response.status === 200) {
        setCategories(response.data.data);
      } else {
        showSnackbar(
          "N'a pas réussi à obtenir les catégories",
          5000,
          SnackbarType.ERROR,
        );
      }
    }
    setIsLoading(false);
  };

  return (
    <div
      className="flex-grow-1 flex flex-row flex-wrap h-full 
  justify-evenly items-center overflow-auto relative py-4 "
    >
      {/* <img
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full object-cover object-top opacity-70 -z-10 dark:opacity-20"
        src={CategoriesBgImg}
        alt=""
      /> */}
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
        <>
          <div
            className="w-full max-w-60  lg:max-w-xs  overflow-hidden rounded-lg border bg-white border-slate-200 dark:bg-gray-800
             dark:border-slate-500 shadow-lg m-4"
            onClick={() => {
              navigate(`/residency`);
            }}
          >
            <div className="w-full flex justify-center">
              <img
                className="h-[130px] md:h-[230px] rounded-xl scale-90 hover:scale-95 transition-all duration-300"
                src={ExamImg}
                alt="image"
              />
            </div>
            <div className="h-max w-full rounded px-3 py-2">
              <h1 className="text-xl md:text-2xl z-40 font-black">
                Résidanat par épreuve
              </h1>
              <h1 className="text-md md:text-lg z-40">Sujet Résidanat</h1>
            </div>
          </div>
          <div
            className="w-full max-w-60  lg:max-w-xs  overflow-hidden rounded-lg border bg-white border-slate-200 dark:bg-gray-800
             dark:border-slate-500 shadow-lg m-4"
            onClick={() => {
              navigate(`/residency-categories`);
            }}
          >
            <div className="w-full flex justify-center">
              <img
                className="h-[130px] md:h-[230px] rounded-xl scale-90 hover:scale-95 transition-all duration-300"
                src={ModuleImg}
                alt="image"
              />
            </div>
            <div className="h-max w-full rounded px-3 py-2">
              <h1 className="text-xl md:text-2xl z-40 font-black">
                Résidanat par module
              </h1>
              <h1 className="text-md md:text-lg z-40">Sujet Résidanat</h1>
            </div>
          </div>

          <div className="fixed bottom-4 right-4 flex flex-col md:flex-row">
            <img
              src={FbImg}
              alt=""
              onClick={() => {
                window.open(
                  "https://www.facebook.com/profile.php?id=100087161524361&mibextid=ZbWKwL",
                  "_blank",
                );
              }}
              className="w-16 md:w-20 cursor-pointer hover:scale-110 transition-all duration-300"
            />
            <img
              src={IgImg}
              alt=""
              onClick={() => {
                window.open(
                  "https://www.instagram.com/doctory_?igsh=MTZlN2xkYjJjemdlNg==",
                  "_blank",
                );
              }}
              className="w-16 md:w-20 cursor-pointer hover:scale-110 transition-all duration-300"
            />
            <img
              src={TeImg}
              alt=""
              onClick={() => {
                window.open("https://t.me/doctory_qcm", "_blank");
              }}
              className="w-16 md:w-20 cursor-pointer hover:scale-110 transition-all duration-300"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ResidencyMenu;
