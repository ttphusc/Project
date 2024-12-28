import React, { useState } from "react";
import { motion } from "framer-motion";

const SideBar = ({ onSortChange }) => {
  const [activeSort, setActiveSort] = useState("newest");

  const handleSortClick = (sortType) => {
    setActiveSort(sortType);
    onSortChange(sortType);
  };

  const menuItems = [
    { id: "newest", label: "Newest", icon: "🕒" },
    { id: "likiest", label: "Most Liked", icon: "❤️" },
    { id: "viewest", label: "Most Viewed", icon: "👁️" },
    { id: "oldest", label: "Oldest", icon: "📅" },
  ];

  return (
    <div className="w-full min-h-screen bg-[#F2F7FB] border-r border-[#E5EDF5] px-4">
      <div className="flex flex-col h-full justify-between py-6">
        <div className="space-y-3">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleSortClick(item.id)}
              className={`
                w-full h-[60px] rounded-xl transition-all duration-200 ease-in-out
                flex items-center px-6 gap-4
                font-wixmadefor text-xl font-medium
                ${
                  activeSort === item.id
                    ? "bg-[#6374AE] text-white shadow-lg transform scale-[1.02]"
                    : "bg-white text-[#6374AE] hover:bg-[#6374AE]/10"
                }
              `}
            >
              <span className="text-2xl">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>

        <div className="space-y-6">
          <hr className="border-[#E5EDF5]" />

          <div className="bg-white rounded-xl p-6 space-y-4 w-full">
            <h4 className="text-[#6374AE] font-semibold">Your Activity</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-[#6374AE]">28</p>
                <p className="text-sm text-gray-500">Posts</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-[#6374AE]">142</p>
                <p className="text-sm text-gray-500">Following</p>
              </div>
            </div>
          </div>

          <div className="text-center space-y-2 w-full">
            <div className="flex items-center justify-center gap-2">
              <svg
                width="24"
                height="24"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
              >
                <circle
                  cx="16"
                  cy="16"
                  r="15"
                  stroke="#6374AE"
                  strokeWidth="2"
                />
                <path
                  d="M10 16.5C10 13.4624 12.4624 11 15.5 11V11C18.5376 11 21 13.4624 21 16.5V21H10V16.5Z"
                  fill="#6374AE"
                />
                <rect
                  x="14"
                  y="8"
                  width="3"
                  height="6"
                  rx="1.5"
                  fill="#6374AE"
                />
                <circle cx="15.5" cy="16.5" r="2.5" fill="white" />
              </svg>
              <span className="text-[#6374AE] font-semibold">
                FitNutritionHub
              </span>
            </div>
            <p className="text-sm text-gray-500">© 2024 All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
