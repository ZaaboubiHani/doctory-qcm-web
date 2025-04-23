import React, { useContext, useState, useEffect, useRef } from "react";
import BgImg from "../assets/bg-1.jpg";
import CategoryImg1 from "../assets/category1.jpg";
import CategoryImg2 from "../assets/category2.jpg";
import CategoryImg3 from "../assets/category3.jpg";
import { CategoriesContext } from "../contexts/CategoriesContext";
import ClipLoader from "react-spinners/ClipLoader";
import { SnackbarContext, SnackbarType } from "../contexts/SnackbarContext";
import { useNavigate } from "react-router-dom";
import FbImg from "../assets/fb.png";
import IgImg from "../assets/ig.png";
import TeImg from "../assets/te.png";
import CategoriesBgImg from "../assets/categories-bg.png";

const CategoryImgs = [CategoryImg1, CategoryImg2, CategoryImg3];

const Categories = () => {
  const navigate = useNavigate();
  const { showSnackbar } = useContext(SnackbarContext);
  const { getCategories, setCategories, categories } =
    useContext(CategoriesContext);
  const [isLoading, setIsLoading] = useState(true);

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
          SnackbarType.ERROR
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
      <img
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full object-cover object-top opacity-70 -z-10 "
        src={CategoriesBgImg}
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
        <>
          {categories.map((category, index) => (
            <div
              key={category._id}
              onClick={() => {
                navigate(`/modules/${category._id}`);
              }}
              className="w-60 h-64 md:w-80 md:h-96 bg-white rounded-3xl cursor-pointer
             shadow-lg p-4 flex flex-col justify-center items-start m-2  border-2 border-teal-500 "
            >
              <div className="w-full flex justify-center">
                <img
                  className="h-[130px] md:h-[230px] rounded-xl scale-90 hover:scale-100 transition-all duration-300"
                  src={CategoryImgs[index]}
                  alt=""
                />
              </div>
              <h1 className="text-xl md:text-2xl z-40 font-black">
                {category.name}
              </h1>
              <h1 className="text-md md:text-lg z-40">
                Modules {category.modulesNum}
              </h1>
              <h1 className="text-md md:text-lg z-40">Cours {category.coursesNum}</h1>
              <h1 className="text-md md:text-lg z-40">
                Questions {category.questionsNum}
              </h1>
            </div>
          ))}
          <div className="fixed bottom-4 right-4 flex flex-col md:flex-row">
            <img
              src={FbImg}
              alt=""
              onClick={() => {
                window.open(
                  "https://www.facebook.com/profile.php?id=100087161524361&mibextid=ZbWKwL",
                  "_blank"
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
                  "_blank"
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

export default Categories;
