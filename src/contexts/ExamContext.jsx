import React, { createContext, useState } from "react";
import Api from "../api/api.source";
export const ExamContext = createContext();
const apiInstance = Api.instance;
const ExamProvider = ({ children }) => {
  const [examQuestions, setExamQuestions] = useState([]);
  const [exam, setExam] = useState([]);
  const [simulations, setSimulations] = useState([]);

  const getRisidantStats = async () => {
    const token = localStorage.getItem("token");
    const response = await apiInstance
      .getAxios()
      .get(`/simulations/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

    return response;
  };

  const getSingleRisidantStats = async (examId) => {
    const token = localStorage.getItem("token");
    const response = await apiInstance
      .getAxios()
      .get(`/simulations/${examId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

    return response;
  };

  const getGeneratedModuleExam = async (module) => {
    const token = localStorage.getItem("token");
    const response = await apiInstance
      .getAxios()
      .get(`/questions/randommodule?module=${module}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

    return response;
  };

  const getGeneratedExam = async (userId) => {
    const token = localStorage.getItem("token");

    const response = await apiInstance.getAxios().post(
      `/simulations/v2`,
      {
        userId: userId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  };

  const submitExam = async (exam, questions) => {
    const token = localStorage.getItem("token");

    var res = questions.map((q) => {
      return {
        question: q.question._id,
        answers: q.selectedChoices,
      };
    });

    const response = await apiInstance.getAxios().put(
      `/simulations/${exam._id}`,
      {
        score: exam.score,
        timeSpent: exam.timeSpent,
        answers: res,
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
    <ExamContext.Provider
      value={{
        examQuestions,
        exam,
        setExam,
        submitExam,
        setExamQuestions,
        getGeneratedModuleExam,
        getGeneratedExam,
        simulations,
        setSimulations,
        getRisidantStats,
        getSingleRisidantStats,
      }}
    >
      {children}
    </ExamContext.Provider>
  );
};

export default ExamProvider;
