import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiLogOut,
  FiBell,
  FiSettings,
  FiUser,
  FiMail,
  FiMenu,
} from "react-icons/fi";

const HeaderAdmin = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    window.location.href = "/signin";
  };

  const notifications = [
    {
      id: 1,
      message: "New user registration",
      time: "5 minutes ago",
      unread: true,
    },
    {
      id: 2,
      message: "New report submitted",
      time: "1 hour ago",
      unread: true,
    },
    {
      id: 3,
      message: "System update completed",
      time: "2 hours ago",
      unread: false,
    },
  ];

  return (
    <header className="w-full bg-white border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Left side - Logo */}
        <div className="flex items-center">
          <button className="p-2 rounded-lg hover:bg-gray-100 lg:hidden">
            <FiMenu size={24} className="text-gray-600" />
          </button>
          <Link to="/" className="flex items-center ml-3">
            {/* <img
              src="/path-to-your-logo.png" // Thêm logo của bạn
              alt="Logo"
              className="h-8 w-auto"
            /> */}
            <span className="ml-3 text-xl font-bold text-[#6374AE]">
              FNH Admin
            </span>
          </Link>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          {/* <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-full hover:bg-gray-100 relative"
            >
              <FiBell size={20} className="text-gray-600" />
              {notifications.filter((n) => n.unread).length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-3 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 hover:bg-gray-50 cursor-pointer ${
                        notification.unread ? "bg-blue-50" : ""
                      }`}
                    >
                      <p className="text-sm text-gray-800">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-gray-200">
                  <button className="text-sm text-[#6374AE] hover:text-[#4A5578] w-full text-center">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div> */}

          {/* Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100"
            >
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt="Profile"
                  className="w-8 h-8 rounded-full border-2 border-gray-200"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[#6374AE] text-white flex items-center justify-center">
                  {user?.firstname?.[0] || "A"}
                </div>
              )}
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900">
                  {user?.firstname} {user?.lastname}
                </p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="py-1">
                  {/* <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <FiUser className="mr-3" size={16} />
                    Profile
                  </button>
                  <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <FiSettings className="mr-3" size={16} />
                    Settings
                  </button>
                  <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <FiMail className="mr-3" size={16} />
                    Messages
                  </button> */}
                  <hr className="my-1" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    <FiLogOut className="mr-3" size={16} />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderAdmin;
