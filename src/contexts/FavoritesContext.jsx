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
      .get(`/favourites/questions?course=${course}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

    return response;
  };

  const getAnswers = async (course) => {
    const token = localStorage.getItem("token");
    const response = await apiInstance
      .getAxios()
      .get(`/answers?course=${course}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

    return response;
  };

  const createAnswer = async (questionId) => {
    const token = localStorage.getItem("token");
    const response = await apiInstance.getAxios().post(
      `/answers`,
      {
        question: questionId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response);
    

    return response;
  };

  const deleteAnswer = async (answerId) => {
    const token = localStorage.getItem("token");
    const response = await apiInstance.getAxios().delete(
      `/answers/${answerId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response;
  };

  const getFavoriteCourses = async (category) => {
    const token = localStorage.getItem("token");
    const response = await apiInstance
      .getAxios()
      .get(`/favourites/courses?module=${category}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    return response;
  };
  const getFavoriteModules = async (category) => {
    const token = localStorage.getItem("token");
    const response = await apiInstance
      .getAxios()
      .get(`/favourites/modules?category=${category}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    return response;
  };


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
    const response = await apiInstance.getAxios().get(`/stats/favourites`, {
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
