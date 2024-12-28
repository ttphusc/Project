import React from "react";

import { FaHome, FaEnvelope, FaUser, FaPhone, FaLock } from "react-icons/fa";
import { Link } from "react-router-dom";
const Sidebar = () => {
  return (
    <div>
      <Link to="/">
        <button className="w-full h-16 bg-slate-100 items-center space-x-2 flex text-gray-600 hover:text-gray-800">
          <div className="px-5">
            <FaHome size={24} />
          </div>
          <span className="text-lg font-semibold">HomePage</span>
        </button>
      </Link>
      <Link to="/user/personal">
        <button className="w-full h-16 bg-slate-100 items-center space-x-2 flex text-gray-600 hover:text-gray-800">
          <div className="px-5">
            <FaUser size={24} />
          </div>
          <span className="text-lg font-semibold">Personal</span>
        </button>
      </Link>
      <Link to="/user/email">
        <button className="w-full h-16 bg-slate-100 items-center space-x-2 flex text-gray-600 hover:text-gray-800">
          <div className="px-5">
            <FaEnvelope size={24} />
          </div>
          <span className="text-lg font-semibold">Email</span>
        </button>
      </Link>
      <Link to="/user/contact">
        <button className="w-full h-16 bg-slate-100 items-center space-x-2 flex text-gray-600 hover:text-gray-800">
          <div className="px-5">
            <FaPhone size={24} />
          </div>
          <span className="text-lg font-semibold">Contact</span>
        </button>
      </Link>
      <Link to="/user/password">
        <button className="w-full h-16 bg-slate-100 items-center space-x-2 flex text-gray-600 hover:text-gray-800">
          <div className="px-5">
            <FaLock size={24} />
          </div>
          <span className="text-lg font-semibold">Password</span>
        </button>
      </Link>
    </div>
  );
};

export default Sidebar;
