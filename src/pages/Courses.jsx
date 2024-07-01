import React, { useContext, useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import BgImg from "../assets/bg-1.jpg";
import { CoursesContext } from "../contexts/CoursesContext";
import ClipLoader from "react-spinners/ClipLoader";
import { SnackbarContext, SnackbarType } from "../contexts/SnackbarContext";

const Courses = () => {
  const { id } = useParams();
  const { showSnackbar } = useContext(SnackbarContext);
  const { getCourses, setCourses, courses } = useContext(CoursesContext);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    initData();
  }, []);
  const initData = async () => {
    const response = await getCourses(id);
    if (response.status === 200) {
      console.log(response.data);
      setCourses(response.data);
    } else {
      showSnackbar(
        "N'a pas réussi à obtenir les courses",
        5000,
        SnackbarType.ERROR
      );
    }

    setIsLoading(false);
  };

  return (
    <div className="flex flex-row h-screen overflow-hidden relative">
      <img
        className="absolute w-full -z-10 opacity-50 h-full object-cover"
        src={BgImg}
        alt=""
      />
      {isLoading ? (
        <div className="flex flex-col justify-evenly items-center w-full h-screen">
          <ClipLoader
            color={"#09BAB0"}
            loading={true}
            size={50}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      ) : (
        <div className="w-full h-screen overflow-y-auto flex justify-evenly items-center flex-wrap">
          {courses.map((e, index) => (
            <div
              key={e._id}
              className="w-80 h-40 bg-white rounded-xl cursor-pointer
         shadow-lg p-4 flex flex-col justify-center items-center m-4 text-xl font-black hover:text-2xl transition-all duration-300 text-center"
            >
              {e.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Courses;
