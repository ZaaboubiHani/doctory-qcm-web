import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CategoriesContext } from "../contexts/CategoriesContext";
import { SnackbarContext, SnackbarType } from "../contexts/SnackbarContext";
import ClipLoader from "react-spinners/ClipLoader";

// Assets
import CategoryImg1 from "../assets/category1.png";
import CategoryImg2 from "../assets/category2.png";
import CategoryImg3 from "../assets/category3.png";
import notebookImg from "../assets/notebook.png";

const Simulation = () => {
  const { getCategories, setCategories, categories } =
    useContext(CategoriesContext);
  const { showSnackbar } = useContext(SnackbarContext);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

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

  const categoryImages = [CategoryImg1, CategoryImg2, CategoryImg3];

  return (
    <div className="flex flex-col h-screen justify-center items-center md:items-start overflow-hidden relative">
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
        <div className="w-full flex flex-wrap gap-6 items-center justify-center">
          {/* General Exam Card */}
          <div
            onClick={() => navigate("/simulation-quiz")}
            className="w-64 h-40 relative 
              bg-gradient-to-br from-teal-600 to-teal-400 
              text-white dark:from-teal-700 dark:to-teal-500
              rounded-2xl shadow-lg p-4 flex flex-col justify-between 
              cursor-pointer hover:scale-105 transition"
          >
            <img
              src={notebookImg}
              className="w-30 h-24 absolute top-2 right-2 object-cover z-0"
              alt="notebook"
            />
            <div>
              <h2 className="text-lg font-bold">
                Simulation
                <br /> Résidanat
              </h2>
              <p className="text-sm opacity-90">
                150 questions <br />
                aléatoires
              </p>
            </div>
          </div>

          {/* Category Exam Cards */}
          {categories.slice(0, 3).map((category, index) => (
            <div
              key={category.id}
              onClick={() => navigate(`/exam/${category._id}?isCategory=true`)}
              className="w-64 h-40 relative 
                bg-white dark:bg-black 
                rounded-2xl shadow-lg p-4 flex flex-col justify-between 
                cursor-pointer hover:scale-105 transition 
                border border-slate-200 dark:border-slate-500"
            >
              <img
                src={categoryImages[index]}
                alt={category.attributes?.name || category.name}
                className="w-24 h-24 absolute top-2 right-2 object-cover z-0"
              />
              <div className="relative z-10">
                <h2 className="text-gray-800 dark:text-gray-100 text-lg font-bold">
                  Simulation <br />
                  {category.attributes?.name || category.name}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  50 questions <br />
                  aléatoires
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Simulation;
