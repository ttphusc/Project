import React, { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link, useLocation, useNavigate, NavLink } from "react-router-dom";
import socket from "../../config/socket";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
const HeaderNew = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const accessToken = localStorage.getItem("accessToken");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showFeatures, setShowFeatures] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isExpert, setIsExpert] = useState(false);
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    // setShowFeatures(false);
  };
  const toggleFeature = () => {
    setShowFeatures(!showFeatures);
    // setMenuOpen(false);
  };
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");

    window.location.href = "/signin";
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setShowDropdown(false);
      return;
    }
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/search`,
        {
          params: { title: searchQuery },
        }
      );

      // Log response data for debugging
      // console.log("Response Data:", response.data);

      // Set results from response
      setSearchResults(response.data.results);
      // console.log("Search Results State:", response.data.results);

      // Update dropdown state based on results length
      setShowDropdown(response.data.results.length > 0);
    } catch (error) {
      console.error("Error searching:", error);
      setShowDropdown(false);
    }
  };

  const handleSelectSearchItem = (item) => {
    // Implement the desired behavior when an item is selected
    navigate(`/search/${item._id}`, { state: { item } });
    setShowDropdown(false);
    setSearchQuery(""); // Clear search input if needed
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setMenuOpen(false);
      setShowFeatures(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (accessToken) {
      try {
        const decodedToken = jwtDecode(accessToken);
        if (decodedToken.role === "expert") {
          setIsExpert(true);
        }
      } catch (error) {
        console.error("Invalid token:", error);
      }
    }
  });

  useEffect(() => {
    // Kiểm tra kết nối socket
    socket.on("connect", () => {
      // console.log("Socket connected:", socket.id);
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    socket.on("send_notification", (data) => {
      const userCurrent = JSON.parse(localStorage.getItem("user"));
      console.log("data::", data);
      console.log("userCurrent::", userCurrent);
      if (userCurrent?._id === data?.receiverId) {
        // console.log("Received new notification:", data);
        setNotifications(data.notifications);
        setShowNotifications(true);
      }
    });

    return () => {
      socket.off("send_notification");
      socket.off("connect");
      socket.off("connect_error");
    };
  }, []);

  const fetchNotifications = async () => {
    const token = localStorage.getItem("accessToken");
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/notification`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setNotifications(response.data.rs);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const handleViewAllNotifications = () => {
    fetchNotifications();
    setShowNotifications(!showNotifications);
  };

  return (
    <div className="w-full bg-[#F2F7FB] shadow-md" ref={menuRef}>
      <div className="max-w-[1440px] mx-auto flex flex-row justify-between items-center h-[80px] px-6">
        {/* Logo & Search Section */}
        <div className="flex items-center gap-8">
          <Link to="/">
            <h1 className="text-[#6374AE] font-lobster font-bold text-3xl hover:text-[#4F5C89] transition-colors">
              FNH
            </h1>
          </Link>

          <form onSubmit={handleSearchSubmit} className="relative">
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Search something..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-[300px] h-[45px] border-2 border-[#9CB6DD] rounded-l-lg px-4 
                         bg-white placeholder:text-[#9CB6DD] text-[#6374AE] 
                         focus:outline-none focus:border-[#6374AE] transition-colors"
              />
              <button
                type="submit"
                className="h-[45px] px-6 bg-[#6374AE] text-white rounded-r-lg
                         hover:bg-[#4F5C89] transition-colors flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </div>

            {/* Dropdown Results */}
            {showDropdown && searchResults.length > 0 && (
              <ul className="absolute left-0 right-0 mt-1 bg-white rounded-lg shadow-lg max-h-[400px] overflow-auto z-50 divide-y divide-gray-100">
                {searchResults.map((item, index) => (
                  <li
                    key={index}
                    onClick={() => handleSelectSearchItem(item)}
                    className="hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                  >
                    <div className="px-4 py-3 flex items-center gap-3">
                      {/* Icon based on type */}
                      <div
                        className={`p-2 rounded-lg ${
                          item.type === "post"
                            ? "bg-blue-50 text-blue-500"
                            : item.type === "question"
                            ? "bg-purple-50 text-purple-500"
                            : "bg-green-50 text-green-500"
                        }`}
                      >
                        {item.type === "post" && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15"
                            />
                          </svg>
                        )}
                        {item.type === "question" && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        )}
                        {item.type === "event" && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-4">
                          <h3
                            className="font-medium text-gray-900 truncate max-w-[70%]"
                            title={item.title}
                          >
                            {item.title}
                          </h3>
                          <span
                            className={`text-xs px-2 py-1 rounded-full capitalize flex-shrink-0 ${
                              item.type === "post"
                                ? "bg-blue-50 text-blue-700"
                                : item.type === "question"
                                ? "bg-purple-50 text-purple-700"
                                : "bg-green-50 text-green-700"
                            }`}
                          >
                            {item.type}
                          </span>
                        </div>

                        {/* Optional: Show preview text if available */}
                        {item.content && (
                          <p
                            className="text-sm text-gray-500 mt-1 line-clamp-2 break-words"
                            title={item.content}
                          >
                            {typeof item.content === "string"
                              ? item.content
                                  .replace(/<[^>]*>/g, "")
                                  .slice(0, 25) +
                                (item.content.length > 25 ? "..." : "")
                              : ""}
                          </p>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </form>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center gap-4">
          <NavLink
            to="/post/posts"
            className={({ isActive }) =>
              `px-6 py-2 rounded-lg font-semibold transition-colors ${
                isActive
                  ? "bg-[#6374AE] text-white"
                  : "text-[#6374AE] hover:bg-[#6374AE]/10"
              }`
            }
          >
            Posts
          </NavLink>
          <NavLink
            to="/question/questions"
            className={({ isActive }) =>
              `px-6 py-2 rounded-lg font-semibold transition-colors ${
                isActive
                  ? "bg-[#6374AE] text-white"
                  : "text-[#6374AE] hover:bg-[#6374AE]/10"
              }`
            }
          >
            Questions
          </NavLink>
          <NavLink
            to="/event/events"
            className={({ isActive }) =>
              `px-6 py-2 rounded-lg font-semibold transition-colors ${
                isActive
                  ? "bg-[#6374AE] text-white"
                  : "text-[#6374AE] hover:bg-[#6374AE]/10"
              }`
            }
          >
            Events
          </NavLink>
        </div>

        {/* User Section */}
        <div className="flex items-center gap-6">
          {/* Notification Icon */}
          <div className="relative">
            <button
              onClick={handleViewAllNotifications}
              className="p-2 rounded-full hover:bg-[#6374AE]/10 transition-colors"
            >
              <svg
                className="w-6 h-6 text-[#6374AE]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </button>
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-3 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification._id}
                      className={`p-3 hover:bg-gray-50 cursor-pointer ${
                        !notification.isRead ? "bg-blue-50" : ""
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={notification.senderId?.avatar}
                          alt={notification.senderId?.firstname}
                          className="w-10 h-10 rounded-full"
                        />
                        <div className="flex-1">
                          <p className="text-sm text-gray-800">
                            {notification.message}
                            {notification.messageCount > 1 &&
                              ` (${notification.messageCount} messages)`}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(notification.createdAt).toLocaleString(
                              "vi-VN",
                              {
                                year: "numeric",
                                month: "numeric",
                                day: "numeric",
                                hour: "numeric",
                                minute: "numeric",
                              }
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-gray-200">
                  <Link to="/notification">
                    <button className="text-sm text-[#6374AE] hover:text-[#4A5578] w-full text-center">
                      View all notifications
                    </button>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Features Icon */}
          <div className="relative">
            <button
              onClick={() => setShowFeatures(!showFeatures)}
              className="p-2 rounded-full hover:bg-[#6374AE]/10 transition-colors"
            >
              <svg
                className="w-6 h-6 text-[#6374AE]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                />
              </svg>
            </button>

            {/* Features Dropdown */}
            {showFeatures && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg overflow-hidden z-50">
                <div className="py-1">
                  <Link to="/recommendation">
                    <button
                      onClick={toggleFeature}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 text-gray-700 flex items-center gap-3"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                        />
                      </svg>
                      Recommendation
                    </button>
                  </Link>
                  <Link to="/chat">
                    <button
                      onClick={toggleFeature}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 text-gray-700 flex items-center gap-3"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                      Chat
                    </button>
                  </Link>
                  <Link to="/event/calendar">
                    <button className="w-full px-4 py-3 text-left hover:bg-gray-50 text-gray-700 flex items-center gap-3">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      Calendar
                    </button>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Menu & Profile */}
          <div className="relative">
            <button
              onClick={toggleMenu}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#6374AE]/10 transition-colors"
            >
              {user ? (
                <img
                  src={user.avatar}
                  alt="Profile"
                  className="w-10 h-10 rounded-full border-2 border-[#9CB6DD] object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-[#6374AE]/20 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-[#6374AE]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
              )}
              <svg
                className="w-5 h-5 text-[#6374AE]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg overflow-hidden z-50">
                {user ? (
                  <div>
                    <Link to="/user/personal">
                      <button
                        onClick={toggleMenu}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 text-gray-700 flex items-center gap-3"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        Profile
                      </button>
                    </Link>
                    <Link to="/favoritelist">
                      <button
                        onClick={toggleMenu}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 text-gray-700 flex items-center gap-3"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          />
                        </svg>
                        Favorites
                      </button>
                    </Link>
                    <Link to="user/manage">
                      <button
                        onClick={toggleMenu}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 text-gray-700 flex items-center gap-3"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                        Manage your content
                      </button>
                    </Link>
                    {isExpert && (
                      <Link to="event/manage">
                        <button
                          onClick={toggleMenu}
                          className="w-full px-4 py-3 text-left hover:bg-gray-50 text-gray-700 flex items-center gap-3"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M3 8h18M3 12h18m-6 8h6M3 16h6"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M4 8V4a1 1 0 011-1h2a1 1 0 011 1v4M16 8V4a1 1 0 011-1h2a1 1 0 011 1v4"
                            />
                          </svg>
                          Manage your event
                        </button>
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 text-red-600 flex items-center gap-3"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 11-6 0v-1m6 0H9"
                        />
                      </svg>
                      Logout
                    </button>
                  </div>
                ) : (
                  <div>
                    <Link to="/signin">
                      <button className="w-full px-4 py-3 text-left hover:bg-gray-50 text-gray-700">
                        Sign In
                      </button>
                    </Link>
                    <Link to="/signup">
                      <button className="w-full px-4 py-3 text-left hover:bg-gray-50 text-gray-700">
                        Sign Up
                      </button>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderNew;
