import React, { createContext, useState, useEffect } from "react";
import Api from "../api/api.source";
import { v4 as uuidv4 } from "uuid";
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

  function getDeviceId() {
    // Check if a device ID is already stored
    let deviceId = localStorage.getItem("deviceId");
    if (!deviceId) {
      // Generate a new UUID
      deviceId = uuidv4();
      localStorage.setItem("deviceId", deviceId);
    }
    return deviceId;
  }

  const updateUserInfo = async (user) => {
    const response = await apiInstance.getAxios().put(
      `/users/${user._id}`,
      {
        name: user.name,
        phoneNumber: user.phoneNumber,
        deviceToken: user.deviceToken,
      },
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );
    return response;
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        createAccount,
        login,
        getMe,
        updateUserInfo,
        getDeviceId,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
