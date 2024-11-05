import React, { createContext, useState } from "react";
import Api from "../api/api.source";
export const NotesContext = createContext();
const apiInstance = Api.instance;
const NotesProvider = ({ children }) => {
  const onCreateQuestionNote = async (questionId, note) => {
    const token = localStorage.getItem("token");
    const response = await apiInstance.getAxios().post(
      `/notes`,
      {
        question: questionId,
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

  const onUpdateQuestionNote = async (noteId, note) => {
    const token = localStorage.getItem("token");
    const response = await apiInstance.getAxios().put(
      `/notes/${noteId}`,
      {
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
  const onRemoveQuestionNote = async (noteId) => {
    const token = localStorage.getItem("token");
    const response = await apiInstance.getAxios().delete(
      `/notes/${noteId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response;
  };
  return (
    <NotesContext.Provider
      value={{
        onCreateQuestionNote,
        onUpdateQuestionNote,
        onRemoveQuestionNote,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
};

export default NotesProvider;
