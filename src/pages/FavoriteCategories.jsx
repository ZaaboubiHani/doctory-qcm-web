import React, { useContext, useState, useEffect, useRef } from "react";
import BgImg from "../assets/bg-1.jpg";
import CategoryImg1 from "../assets/category1.jpg";
import CategoryImg2 from "../assets/category2.jpg";
import CategoryImg3 from "../assets/category3.jpg";
import { FavoritesContext } from "../contexts/FavoritesContext";
import ClipLoader from "react-spinners/ClipLoader";
import { SnackbarContext, SnackbarType } from "../contexts/SnackbarContext";
import WingsImg from "../assets/wings.png";
import { useNavigate } from "react-router-dom";
import CategoriesBgImg from "../assets/categories-bg.png";

const CategoryImgs = [CategoryImg1, CategoryImg2, CategoryImg3];
const FavoriteCategories = () => {
  const navigate = useNavigate();
  const { showSnackbar } = useContext(SnackbarContext);
  const { getFavoriteCategories, setCategories, categories } =
    useContext(FavoritesContext);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    initData();
  }, []);
  const initData = async () => {
    setIsLoading(true);
    if (categories.length === 0) {
      const response = await getFavoriteCategories();
      if (response.status === 200) {
        setCategories(response.data);
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
    justify-evenly items-center overflow-auto relative py-4"
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
          {categories.map((e, index) => (
            <div
              key={e.category._id}
              onClick={() => {
                navigate(`/favorites-modules/${e.category._id}`);
              }}
              className="w-60 h-64 md:w-80 md:h-96 bg-white rounded-3xl cursor-pointer
             shadow-lg p-4 flex flex-col justify-center items-start m-2"
            >
              <div className="w-full flex justify-center">
                <img
                  className="h-[130px] md:h-[230px] rounded-xl hover:scale-110 transition-all duration-300"
                  src={CategoryImgs[index]}
                  alt=""
                />
              </div>
              <h1 className="text-xl md:text-2xl z-40 font-black">
                {e.category.name}
              </h1>
              <h1 className="text-md md:text-lg z-40">
                Modules {e.modulesNum}
              </h1>
              <h1 className="text-md md:text-lg z-40">Cours {e.coursesNum}</h1>
              <h1 className="text-md md:text-lg z-40">
                Questions {e.questionsNum}
              </h1>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default FavoriteCategories;
