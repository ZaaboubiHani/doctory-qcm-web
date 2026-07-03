import React, { useContext, useEffect, useState } from "react";

const ReportDialog = ({ onSubmit, isOpen, onClose }) => {
  const [text, setText] = useState();

  useEffect(() => {
    setText("");
  }, [isOpen]);

  return (
    <div
      className={`${isOpen ? "flex" : "hidden"
        } fixed top-0 bottom-0 left-0 right-0 w-full h-full`}
    >
      <div
        className="bg-black opacity-50 w-full h-full absolute"
        onClick={() => {
          onClose();
        }}
      ></div>
           <div className="max-w-[500px] w-full flex flex-col justify-center items-center h-[250px] absolute bg-white dark:bg-gray-800 rounded-xl shadow-2xl shadow-slate-950/5 border border-slate-200 dark:border-slate-500 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4">
        <div class="relative w-full min-w-[200px]">
          <textarea
            value={text}
            class="peer h-full min-h-[100px] w-full resize-none rounded-[7px] border border-blue-gray-200 bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 
            outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-teal-900
             focus:border-t-transparent focus:outline-0 disabled:resize-none disabled:border-0 disabled:bg-blue-gray-50"
            onChange={(event) => {
              setText(event.target.value);
            }}
            placeholder=" "></textarea>
          <label
            class="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block 
            before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t 
            after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] 
            peer-focus:leading-tight peer-focus:text-teal-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-teal-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:border-teal-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
            Signal
          </label>
        </div>

        <div
          className={`bg-teal-500 w-fit rounded-xl cursor-pointer
              shadow-lg p-4 flex justify-start items-center mt-4
              text-md font-black hover:text-lg
              transition-all duration-300 text-left`}
          onClick={() => {
            onClose();
            onSubmit(text);
          }}
        >
          Envoyer
        </div>
      </div>
    </div>
  );
};

export default ReportDialog;
