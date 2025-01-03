import React, { useContext } from "react";
import { SnackbarContext, SnackbarType } from "../contexts/SnackbarContext";
const Snackbar = () => {
  const { message, isOpen, type } = useContext(SnackbarContext);
  return (
    <div
      className={`fixed z-50 ${
        isOpen ? "bottom-4" : "-bottom-16"
      } px-16 w-full flex justify-center items-center transition-all duration-300`}
    >
      <div
        className={`w-min-[300px] max-h-52 min-h-12 h-fit flex justify-center items-center rounded-lg p-4 text-white overflow-y-auto
                    ${
                      type === SnackbarType.SUCCESS
                        ? "bg-green-500"
                        : type === SnackbarType.ERROR
                        ? "bg-red-500"
                        : type === SnackbarType.WARNING
                        ? "bg-orange-500"
                        : "bg-blue-500"
                    }`}
      >
        {message}
      </div>
    </div>
  );
};

export default Snackbar;
