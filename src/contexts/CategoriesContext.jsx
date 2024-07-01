import React, { createContext, useState } from "react";
import Api from "../api/api.source";
export const CategoriesContext = createContext();
const apiInstance = Api.instance;
const CategoriesProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);

  const getCategories = async () => {
    const token = localStorage.getItem("token");
    const response = await apiInstance.getAxios().get(`/categories/stats`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  };
  return (
    <CategoriesContext.Provider value={{ getCategories, setCategories ,categories }}>
      {children}
    </CategoriesContext.Provider>
  );
};

export default CategoriesProvider;
