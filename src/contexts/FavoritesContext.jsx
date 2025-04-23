import React, { createContext, useState } from "react";
import Api from "../api/api.source";
export const FavoritesContext = createContext();
const apiInstance = Api.instance;
const FavoritesProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState();
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);

  const getFavoriteQuestions = async (course) => {
    const token = localStorage.getItem("token");
    const response = await apiInstance
      .getAxios()
      .get(`/favourites/v2/questions`, {
        params: {
          course: course,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

    return response;
  };

  const getAnswers = async (course) => {
    const token = localStorage.getItem("token");
    const response = await apiInstance.getAxios().get(`/answers/v2`, {
      params: {
        course: course,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  };

  const createAnswer = async (questionId) => {
    const token = localStorage.getItem("token");
    const response = await apiInstance.getAxios().post(
      `/answers/v2`,
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

  const deleteAnswer = async (answerId) => {
    const token = localStorage.getItem("token");
    const response = await apiInstance
      .getAxios()
      .delete(`/answers/v2/${answerId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

    return response;
  };

  const getFavoriteCourses = async (module) => {
    const token = localStorage.getItem("token");
    const year = localStorage.getItem("year");
    const response = await apiInstance
      .getAxios()
      .get(`/favourites/v2/courses`, {
        params: {
          module: module,
          year: year,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    return response;
  };

  const getFavoriteModules = async (category) => {
    const token = localStorage.getItem("token");
    const year = localStorage.getItem("year");
    const response = await apiInstance
      .getAxios()
      .get(`/favourites/v2/modules`, {
        params: {
          category: category,
          year: year,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    return response;
  };

  const onCreateFavoriteQuestion = async (questionId) => {
    const token = localStorage.getItem("token");
    const response = await apiInstance.getAxios().post(
      `/favourites/v2`,
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
    const response = await apiInstance
      .getAxios()
      .delete(`/favourites/${questionId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

    return response;
  };

  const getFavoriteCategories = async () => {
    const token = localStorage.getItem("token");
    const response = await apiInstance
      .getAxios()
      .get(`/favourites/v2/categories`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

    return response;
  };

  return (
    <FavoritesContext.Provider
      value={{
        onCreateFavoriteQuestion,
        onRemoveFavoriteQuestion,
        getFavoriteCategories,
        categories,
        setCategories,
        getFavoriteModules,
        setModules,
        modules,
        selectedModule,
        setSelectedModule,
        getFavoriteCourses,
        setCourses,
        courses,
        selectedCourse,
        setSelectedCourse,
        getFavoriteQuestions,
        setQuestions,
        questions,
        answers,
        setAnswers,
        getAnswers,
        deleteAnswer,
        createAnswer,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export default FavoritesProvider;
