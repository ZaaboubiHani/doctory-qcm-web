import React, { useContext } from 'react';
import { SnackbarContext,SnackbarType } from '../contexts/SnackbarContext';

const Snackbar = () => {
    const { message, isOpen,type } = useContext(SnackbarContext);
    return <div className={`fixed z-50 ${isOpen ? 'bottom-4' : '-bottom-12'} w-full flex justify-center items-center transition-all duration-300`}>
        <div className={`w-min-[300px] h-12 flex justify-center items-center rounded-lg px-4 text-white
            ${type === SnackbarType.SUCCESS ? "bg-green-500" : 
            type === SnackbarType.ERROR ? "bg-red-500" :
            type === SnackbarType.WARNING ? "bg-orange-500" :
            "bg-blue-500"}`}>
            {message}
        </div>
    </div>;
};

export default Snackbar;
