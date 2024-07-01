import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { MdLockOpen } from "react-icons/md";
const PasswordField = ({ className , onChange}) => {
    const [isFocused, setFocused] = useState(false);
    const [visibility, setVisibility] = useState(false);
    return <div className={className}>
        <div className={`flex flex-row items-center rounded-2xl border border-1
         bg-white shadow-[0_3px_15px_1px_rgba(9,186,176,0.3)] 
         ${isFocused ? 'border-[rgb(9,186,176)]' : 'border-transparent'}
         transition-all duration-300`}>
            <MdLockOpen className='text-3xl ml-4' />
            <input
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder='Mot de passe'
                className='p-2 w-[250px] flex items-center justify-between rounded-2xl text-xl 
                 focus:ring-0 outline-none border-transparent focus:border-primary'
                type={visibility ? 'text' : 'password'}
                onChange={onChange}
            />
            <button
                onClick={() => setVisibility(!visibility)}
                className='mr-4'>
                {
                    visibility ? <FaEyeSlash  className='text-3xl' /> : <FaEye className='text-3xl' />
                }
            </button>
        </div>
    </div>;
};

export default PasswordField;
