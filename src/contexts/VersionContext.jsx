import React, { createContext, useState } from "react";
import Api from "../api/api.source";
export const VersionContext = createContext();
const apiInstance = Api.instance;
const VersionProvider = ({ children }) => {
  const [version, setVersion] = useState();

  const getLatestVersion = async () => {
    const token = localStorage.getItem("token");
    const response = await apiInstance.getAxios().get(`/versions/last`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  };

  return (
    <VersionContext.Provider
      value={{
        version,
        setVersion,
        getLatestVersion,
      }}
    >
      {children}
    </VersionContext.Provider>
  );
};

export default VersionProvider;
