import React from "react";
import { Link } from "react-router-dom";

const NavBar = () => {
  const navLinks = ["Newest", "Followings", "Trending", "Bookmark"];

  return (
    <div className="bg-[#073B3A] text-white py-5 flex">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex space-x-8">
          {navLinks.map((link, index) => (
            <Link
              key={index}
              to="/"
              className="hover:text-gray-400 text-lg font-bold"
            >
              {link}
            </Link>
          ))}
        </div>

        <CreateButton />
      </div>
    </div>
  );
};
const CreateButton = () => {
  return (
    <div className="bg-[#0B6E4F] flex items-center justify-center w-32 h-12 rounded-lg">
      <button className="text-white font-bold flex items-center hover:text-gray-800">
        <svg
          width="30"
          height="30"
          viewBox="0 0 47 47"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-8 h-8 mr-2"
        >
          <path
            d="M9.79165 31.3333L7.83331 39.1667L15.6666 37.2083L39.7108 13.1642C40.4918 12.3832 40.4918 11.1168 39.7108 10.3358L36.6642 7.28921C35.8831 6.50816 34.6168 6.50816 33.8358 7.28921L9.79165 31.3333Z"
            stroke="#FFFAFA"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M29.375 11.75L35.25 17.625"
            stroke="#FFFAFA"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M25.4583 39.1667H41.125"
            stroke="#FFFAFA"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        CREATE
      </button>
    </div>
  );
};

export default NavBar;
