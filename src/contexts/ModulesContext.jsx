import React, { createContext, useState } from "react";
import Api from "../api/api.source";
export const ModulesContext = createContext();
const apiInstance = Api.instance;
const ModulesProvider = ({ children }) => {
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState();

  const getModules = async (category) => {
    const token = localStorage.getItem("token");
    const year = localStorage.getItem("year");
    const response = await apiInstance.getAxios().get('/modules/v2', {
      params: {
        category: category,
        year: year,
      },
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    return response;
  };
  return (
    <ModulesContext.Provider
      value={{
        getModules,
        setModules,
        modules,
        selectedModule,
        setSelectedModule,
      }}
    >
      {children}
    </ModulesContext.Provider>
  );
};

export default ModulesProvider;
