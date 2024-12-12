import React, { useContext, useState, useEffect, useRef } from "react";
import BgImg from "../assets/bg-1.jpg";
import CategoryImg1 from "../assets/category1.jpg";
import CategoryImg2 from "../assets/category2.jpg";
import CategoryImg3 from "../assets/category3.jpg";
import { CategoriesContext } from "../contexts/CategoriesContext";
import ClipLoader from "react-spinners/ClipLoader";
import { SnackbarContext, SnackbarType } from "../contexts/SnackbarContext";
import { useNavigate } from "react-router-dom";
import WingsImg from "../assets/wings.png";


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
    className="absolute top-0 left-0 w-full h-full object-cover object-top blur-sm opacity-50 -z-10"
    src={WingsImg}
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
            navigate(`/modules/${e.category._id}`);
          }}
          className="w-80 h-96 bg-white rounded-xl cursor-pointer
             shadow-lg p-4 flex flex-col justify-center items-start m-2"
        >
          <div className="w-full flex justify-center">
            <img
              className="h-[230px] rounded-xl hover:h-[240px] transition-all duration-300"
              src={CategoryImgs[index]}
              alt=""
            />
          </div>
          <h1 className="text-2xl z-40 font-black">{e.category.name}</h1>
          <h1 className="text-lg z-40">Modules {e.modulesNum}</h1>
          <h1 className="text-lg z-40">Cours {e.coursesNum}</h1>
          <h1 className="text-lg z-40">Questions {e.questionsNum}</h1>
        </div>
      ))}
    </>
  )}
</div>
  );
};

export default Categories;
