import React, { useState } from 'react';

const TextField = ({ placeholder, className,type,icon,onChange }) => {
    const [isFocused, setFocused] = useState(false);
    return <div className={className}>
        <div className={`flex flex-row items-center rounded-2xl border border-1
         bg-white shadow-[0_3px_15px_1px_rgba(9,186,176,0.3)] 
         ${isFocused ? 'border-[rgb(9,186,176)]' : 'border-transparent'}
         transition-all duration-300`}>
            {icon}
            <input
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder={placeholder}
                onChange={onChange}
                className='p-2 w-full flex items-center justify-between rounded-2xl text-xl  
                focus:ring-0 outline-none border-transparent focus:border-[rgb(9,186,176)]'
                type={type}
            />
        </div>
    </div>;
};

export default TextField;
