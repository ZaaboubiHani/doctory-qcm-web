import React, { createContext, useState } from 'react';
export const SnackbarContext = createContext();
export const SnackbarType = {
    SUCCESS: 'success',
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info',
  };
const SnackbarProvider = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [type, setType] = useState(SnackbarType.SUCCESS);
    const handleClose = () => {
        setIsOpen(false);
    };
    const showSnackbar = (msg, delay,type) => {
        setMessage(msg);
        setIsOpen(true);
        if(type){
            setType(type)
        }else{
            setType(SnackbarType.SUCCESS);
        }
        setTimeout(() => {
            handleClose();
        }, delay);
    };
    return <SnackbarContext.Provider value={{ isOpen, message, type,showSnackbar }}>
        {children}
    </SnackbarContext.Provider>;
};

export default SnackbarProvider;
