import React, { createContext, useState } from "react";
import Api from "../api/api.source";
export const ResidencyContext = createContext();
const apiInstance = Api.instance;
const ResidencyProvider = ({ children }) => {
  const [residencies, setResidencies] = useState([]);
  const [residencyQuestions, setResidencyQuestions] = useState([]);
  const [selectedResidency, setSelectedResidency] = useState();

  const getResidencies = async (category) => {
    const token = localStorage.getItem("token");
    const response = await apiInstance.getAxios().get(`/residencies/v2${category ? `?category=${category}` : ""}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  };

  const getResidencyQuestionsWithDetails = async (residencyId) => {
    const token = localStorage.getItem("token");
    const response = await apiInstance
      .getAxios()
      .get(`/residencyQuestions?residency=${residencyId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    return response;
  };

  const onCreateResidencyQuestionNote = async (residencyId, note) => {
    const token = localStorage.getItem("token");
    const response = await apiInstance.getAxios().post(
      `/notes?residency=${residencyId}`,
      {
        residencyQuestion: residencyId,
        note: note,
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
    <ResidencyContext.Provider
      value={{
        residencies,
        setResidencies,
        selectedResidency,
        setSelectedResidency,
        getResidencies,
        residencyQuestions,
        setResidencyQuestions,
        getResidencyQuestionsWithDetails,
        onCreateResidencyQuestionNote,
      }}
    >
      {children}
    </ResidencyContext.Provider>
  );
};

export default ResidencyProvider;
