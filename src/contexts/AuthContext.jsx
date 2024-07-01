import React, { createContext, useState, useEffect } from "react";
import Api from "../api/api.source";
export const AuthContext = createContext();
const apiInstance = Api.instance;
const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState();

  const createAccount = async (user) => {
    const response = await apiInstance.getAxios().post(`/users/register`, user);
    return response;
  };
  const login = async (user) => {
    const response = await apiInstance.getAxios().post(`/users/login`, user);
    return response;
  };
  const getMe = async (token) => {
    const response = await apiInstance.getAxios().get(`/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
    
  };

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser,createAccount, login,getMe }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
