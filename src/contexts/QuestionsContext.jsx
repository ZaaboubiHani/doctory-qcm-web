import React, { createContext, useState } from "react";
import Api from "../api/api.source";
export const QuestionsContext = createContext();
const apiInstance = Api.instance;
const QuestionsProvider = ({ children }) => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);

  const getQuestions = async (course) => {
    const token = localStorage.getItem("token");
    const response = await apiInstance.getAxios().get(`/questions/v2/details`, {
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

  return (
    <QuestionsContext.Provider
      value={{
        getQuestions,
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
    </QuestionsContext.Provider>
  );
};

export default QuestionsProvider;
