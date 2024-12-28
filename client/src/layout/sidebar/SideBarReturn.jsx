import React from "react";
import { useNavigate } from "react-router-dom";

const SideBarReturn = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <div className="w-full min-h-screen bg-[#F2F7FB]  flex flex-col justify-between">
      <button
        onClick={handleBackClick}
        className="group relative transition-all duration-300 hover:translate-x-2"
      >
        <div className="h-[70px] w-full bg-gradient-to-r from-[#6374AE] to-[#7A89BC] hover:from-[#4F5E99] hover:to-[#6374AE] py-3 rounded-tr-[12px] rounded-br-[12px] items-center flex justify-evenly font-wixmadefor font-bold text-3xl text-[#F2F7FB] shadow-lg hover:shadow-xl transition-all duration-300">
          <svg
            width="50"
            height="50"
            viewBox="0 0 50 50"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="transform transition-all duration-300 group-hover:-translate-x-2"
          >
            <path
              d="M31.25 12.5L18.75 25L31.25 37.5"
              stroke="#F2F7FB"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="drop-shadow-md"
            />
          </svg>
          <h1 className="drop-shadow-md">Back</h1>
        </div>
      </button>

      <div className="mb-8">
        <hr className="h-[3px] w-full bg-gradient-to-r from-transparent via-[#6374AE] to-transparent opacity-20" />
        <div className="flex h-[200px] items-center justify-center text-xl font-medium text-center">
          <div className="w-full justify-center space-y-2">
            <h3 className="text-[#6374AE] opacity-80 hover:opacity-100 transition-all duration-300 hover:scale-105 cursor-default">
              © 2024 FitNutritionHub.
              <br />
              <span className="text-sm text-[#8895C5]">
                All rights reserved.
              </span>
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideBarReturn;
