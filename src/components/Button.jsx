import React, { useState } from 'react';
const Button = ({ className, text, icon,onClick }) => {


    return (
        <div className={className}>
          <button
            className="bg-primary w-[350px] p-2 rounded-2xl text-2xl
             text-white shadow-[0_3px_15px_1px_rgba(255,255,255,0.3)] flex justify-center"
          onClick={onClick}
          >
            {icon}
            {text}
          </button>
        </div>
    );
};

export default Button;
