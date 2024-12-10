import React, { createContext, useState } from "react";
import Api from "../api/api.source";
export const CoursesContext = createContext();
const apiInstance = Api.instance;
const CoursesProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState();

  const getCourses = async (module) => {
    const token = localStorage.getItem("token");
    const response = await apiInstance
      .getAxios()
      .get(`/courses?module=${module}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    return response;
  };
  return (
    <CoursesContext.Provider
      value={{
        getCourses,
        setCourses,
        courses,
        selectedCourse,
        setSelectedCourse,
      }}
    >
      {children}
    </CoursesContext.Provider>
  );
};

export default CoursesProvider;
