import React, { createContext, useState } from "react";
import Api from "../api/api.source";
export const FavoritesContext = createContext();
const apiInstance = Api.instance;
const FavoritesProvider = ({ children }) => {
  const [questions, setQuestions] = useState([]);

  const onCreateFavoriteQuestion = async (questionId) => {
    const token = localStorage.getItem("token");
    const response = await apiInstance.getAxios().post(
      `/favourites`,
      {
        question: questionId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response;
  };

  const onRemoveFavoriteQuestion = async (questionId) => {
    const token = localStorage.getItem("token");
    const response = await apiInstance.getAxios().delete(
      `/favourites/${questionId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response;
  };
  return (
    <FavoritesContext.Provider value={{
      onCreateFavoriteQuestion,
      onRemoveFavoriteQuestion,
    }}>{children}</FavoritesContext.Provider>
  );
};

export default FavoritesProvider;
