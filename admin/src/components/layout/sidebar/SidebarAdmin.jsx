import React from "react";
import { Link, useLocation } from "react-router-dom";
import { RiDashboardLine } from "react-icons/ri";
import { FiUsers, FiFileText, FiHelpCircle } from "react-icons/fi";
import { MdOutlineReport } from "react-icons/md";
import { BsCalendarEvent } from "react-icons/bs";
import { FaRegUserCircle } from "react-icons/fa";

const SidebarAdmin = () => {
  const location = useLocation();

  const menuItems = [
    { path: "/", label: "Dashboard", icon: <RiDashboardLine size={22} /> },
    { path: "/user", label: "User", icon: <FiUsers size={22} /> },
    { path: "/post", label: "Post", icon: <FiFileText size={22} /> },
    { path: "/question", label: "Question", icon: <FiHelpCircle size={22} /> },
    { path: "/report", label: "Report", icon: <MdOutlineReport size={22} /> },
    { path: "/event", label: "Event", icon: <BsCalendarEvent size={22} /> },
  ];

  return (
    <div className="w-1/5 bg-gradient-to-b from-[#F2F7FB] to-white min-h-screen shadow-lg">
      {/* Admin Profile */}
      <div className="pt-8 pb-6 px-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-full bg-[#6374AE] flex items-center justify-center text-white">
            <FaRegUserCircle size={28} />
          </div>
          <div>
            <h3 className="font-bold text-[#2D3748]">Admin Name</h3>
            <p className="text-sm text-gray-600">Administrator</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="px-4">
        {menuItems.map((item) => (
          <Link to={item.path} key={item.path}>
            <div
              className={`h-[50px] mx-auto mb-2 flex items-center px-4 
                ${
                  location.pathname === item.path
                    ? "bg-[#6374AE] text-white"
                    : "text-[#2D3748] hover:bg-[#E2E8F0]"
                } 
                rounded-lg font-medium text-[15px] transition-all duration-200
                hover:shadow-md transform hover:translate-x-1 group`}
            >
              <span className={`mr-3 ${
                location.pathname === item.path
                  ? "text-white"
                  : "text-[#6374AE] group-hover:text-[#6374AE]"
              }`}>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 w-1/5 pb-6">
        <div className="px-6">
          <hr className="bg-[#D3E2F2] h-[1px] mb-6" />
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-sm text-gray-600">Online Status</span>
          </div>
          <div className="text-[#6374AE] font-medium text-xs">
            <p>© 2024 FitNutritionHub.</p>
            <p>All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarAdmin;
