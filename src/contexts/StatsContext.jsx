import React, { createContext, useState, useEffect } from "react";
import Api from "../api/api.source";
export const StatsContext = createContext();
const apiInstance = Api.instance;
const StatsProvider = ({ children }) => {
  const [categoriesStats, setCategoriesStats] = useState();
  const [selectedCategory, setSelectedCategory] = useState();

  const [modulesStats, setModulesStats] = useState();
  const [selectedModule, setSelectedModule] = useState();

  const [coursesStats, setCoursesStats] = useState();

  const getAllCategoriesStats = async () => {
    const token = localStorage.getItem("token");
    const response = await apiInstance
      .getAxios()
      .get(`/stats/answers-per-category`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    return response;
  };

  const getModulesStatsOfCategory = async (categoryId) => {
    const token = localStorage.getItem("token");
    const response = await apiInstance
      .getAxios()
      .get(`/stats/answers-per-module?category=${categoryId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    return response;
  };

  const getCoursesStatsOfModule = async (moduleId) => {
    const token = localStorage.getItem("token");
    const response = await apiInstance
      .getAxios()
      .get(`/stats/answers-per-course?module=${moduleId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    return response;
  };

  return (
    <StatsContext.Provider
      value={{
        categoriesStats,
        setCategoriesStats,
        getAllCategoriesStats,
        selectedCategory,
        setSelectedCategory,
        modulesStats,
        setModulesStats,
        getModulesStatsOfCategory,
        selectedModule,
        setSelectedModule,
        coursesStats,
        setCoursesStats,
        getCoursesStatsOfModule,
      }}
    >
      {children}
    </StatsContext.Provider>
  );
};

export default StatsProvider;
