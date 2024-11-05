import React, { createContext, useState } from "react";
import Api from "../api/api.source";
export const QuestionsContext = createContext();
const apiInstance = Api.instance;
const QuestionsProvider = ({ children }) => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);

  const getQuestions = async (course) => {
    const token = localStorage.getItem("token");
    const response = await apiInstance
      .getAxios()
      .get(`/questions/details?course=${course}`, {
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
