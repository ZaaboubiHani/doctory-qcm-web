import React, { createContext, useState } from "react";
import Api from "../api/api.source";
export const CoursesContext = createContext();
const apiInstance = Api.instance;
const CoursesProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);

  const getCourses = async (category) => {
    const token = localStorage.getItem("token");
    const response = await apiInstance.getAxios().get(`/courses?module=${category}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  };
  return (
    <CoursesContext.Provider value={{ getCourses, setCourses ,courses }}>
      {children}
    </CoursesContext.Provider>
  );
};

export default CoursesProvider;
