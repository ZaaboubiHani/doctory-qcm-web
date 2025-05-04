import React, { useContext, useEffect, useState } from "react";

const MessageBox = ({ text, onOk, isOpen, onClose }) => {
  return (
  //   <div class="flex justify-center">
  //   <div
  //     class="fixed inset-0 bg-slate-950/50 flex justify-center items-center opacity-0 pointer-events-none transition-opacity duration-300 ease-out z-[9999]"
  //     id="messageBoxModal"
  //     aria-hidden="true"
  //   >
  //     <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl shadow-slate-950/5 border border-slate-200 dark:border-slate-500 scale-95">
  //       <div class="p-4 pb-2 flex justify-between items-center">
  //         <h1 class="text-lg text-slate-800 dark:text-slate-100 font-semibold">
  //           {text}
  //         </h1>
  //       </div>

  //       <div class="p-4 flex justify-around gap-2">
         
  //         <button
  //           onClick={() => {
  //             onOk();
  //           }}
  //           type="button"
  //           data-dismiss="modal"
  //           class="inline-flex items-center justify-center border align-middle 
  //                 select-none font-sans font-medium text-center transition-all duration-300 ease-in 
  //                 disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed data-[shape=pill]:rounded-full 
  //                 data-[width=full]:w-full focus:shadow-none text-sm rounded-md py-2 px-4 bg-transparent border-transparent 
  //                 text-green-500 hover:bg-green-500/10 hover:border-green-500/10 shadow-none hover:shadow-none outline-none"
  //         >
  //           Ok
  //         </button>
  //       </div>
  //     </div>
  //   </div>
  // </div>
    <div
    
      className={`${
        isOpen ? "flex" : "hidden"
      } fixed top-0 bottom-0 left-0 right-0 w-full h-full`}
    >
      <div
        className="bg-slate-950/50 opacity-50 w-full h-full absolute"
        onClick={() => {
          onClose();
        }}
      ></div>
      <div className="bg-white dark:bg-gray-800 max-w-[500px] w-full flex flex-col justify-center items-center h-[250px] absolute rounded-lg shadow-lg top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4">
        <h1
          value={text}
          onChange={(event) => {
            setText(event.target.value);
          }}
          className="p-2 w-full h-[100px] flex items-center justify-between rounded-lg mt-2 text-xl  
                 resize-none"
        >
          {text}
        </h1>
       
          <div
            className={`bg-teal-500 w-fit rounded-xl cursor-pointer
              shadow-lg p-4 flex justify-start items-center mt-4
              text-md font-black hover:text-lg
              transition-all duration-300 text-left`}
            onClick={() => {
              onClose();
              onOk();
            }}
          >
            OK
          </div>
         
        
      </div>
    </div>
  );
};

export default MessageBox;
