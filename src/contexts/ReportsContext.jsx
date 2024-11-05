import React, { createContext, useState } from "react";
import Api from "../api/api.source";
export const ReportsContext = createContext();
const apiInstance = Api.instance;
const ReportsProvider = ({ children }) => {

  const onCreateReport = async (questionId, report) => {
    const token = localStorage.getItem("token");
    const response = await apiInstance.getAxios().post(
      `/reports`,
      {
        question: questionId,
        signal: report,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response;
  };

 
  return (
    <ReportsContext.Provider
      value={{
        onCreateReport,
      }}
    >
      {children}
    </ReportsContext.Provider>
  );
};

export default ReportsProvider;
