import React from "react";
import { Link, useLocation } from "react-router-dom";

const SideBarUser = () => {
  const location = useLocation();

  return (
    <div className="w-full min-h-screen px-8 py-10">
      <div className="flex flex-col gap-4">
        <h1 className=" text-2xl font-wixmadefor text-[#6374AE] font-bold mb-6">
          Settings
        </h1>

        <Link to="/user/personal">
          <div
            className={`h-[52px] w-full flex items-center px-6 ${
              location.pathname === "/user/personal"
                ? "bg-[#6374AE] text-white"
                : "bg-[#F8FAFF] text-[#6374AE] hover:bg-[#F2F7FB]"
            } rounded-[10px] font-wixmadefor font-medium text-base transition-all duration-200`}
          >
            Personal Information
          </div>
        </Link>

        <Link to="/user/contact">
          <div
            className={`h-[52px] w-full flex items-center px-6 ${
              location.pathname === "/user/contact"
                ? "bg-[#6374AE] text-white"
                : "bg-[#F8FAFF] text-[#6374AE] hover:bg-[#F2F7FB]"
            } rounded-[10px] font-wixmadefor font-medium text-base transition-all duration-200`}
          >
            Contact Details
          </div>
        </Link>

        <Link to="/user/password">
          <div
            className={`h-[52px] w-full flex items-center px-6 ${
              location.pathname === "/user/password"
                ? "bg-[#6374AE] text-white"
                : "bg-[#F8FAFF] text-[#6374AE] hover:bg-[#F2F7FB]"
            } rounded-[10px] font-wixmadefor font-medium text-base transition-all duration-200`}
          >
            Change Password
          </div>
        </Link>

        <Link to="/user/email">
          <div
            className={`h-[52px] w-full flex items-center px-6 ${
              location.pathname === "/user/email"
                ? "bg-[#6374AE] text-white"
                : "bg-[#F8FAFF] text-[#6374AE] hover:bg-[#F2F7FB]"
            } rounded-[10px] font-wixmadefor font-medium text-base transition-all duration-200`}
          >
            Email Settings
          </div>
        </Link>

        <Link to="/user/attributes">
          <div
            className={`h-[52px] w-full flex items-center px-6 ${
              location.pathname === "/user/attributes"
                ? "bg-[#6374AE] text-white"
                : "bg-[#F8FAFF] text-[#6374AE] hover:bg-[#F2F7FB]"
            } rounded-[10px] font-wixmadefor font-medium text-base transition-all duration-200`}
          >
            Profile Attributes
          </div>
        </Link>
      </div>

      <div className=" bottom-0 left-0 w-full px-8 py-6">
        <hr className="w-full h-[1px] bg-[#E5E7EB] mb-6" />
        <div className="text-center text-[#6374AE] font-wixmadefor">
          <p className="text-sm font-medium">© 2024 FitNutritionHub</p>
          <p className="text-sm">All rights reserved</p>
        </div>
      </div>
    </div>
  );
};

export default SideBarUser;
