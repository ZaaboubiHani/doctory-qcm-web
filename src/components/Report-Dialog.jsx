import React, { useContext, useEffect, useState } from "react";

const ReportDialog = ({ onSubmit, isOpen,  onClose }) => {
  const [text, setText] = useState();
  
  useEffect(() => {
   setText("");
  }, [isOpen]);
  
  return (
    <div
      className={`${
        isOpen ? "flex" : "hidden"
      } fixed top-0 bottom-0 left-0 right-0 w-full h-full`}
    >
      <div
        className="bg-black opacity-50 w-full h-full absolute"
        onClick={() => {
          onClose();
        }}
      ></div>
      <div className="bg-white max-w-[500px] w-full flex flex-col justify-center items-center h-[250px] absolute rounded-lg shadow-lg top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4">
      Signal
        <textarea
          value={text}
          placeholder="Signal"
          onChange={(event) => {
            setText(event.target.value);
          }}
          className="p-2 w-full h-[100px] flex items-center justify-between rounded-lg mt-2 text-xl  
                ring-1 outline-1 resize-none"
        />
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
