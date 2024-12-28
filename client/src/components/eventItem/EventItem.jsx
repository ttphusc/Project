import React, { useEffect, useState } from "react";
import { formatTimeCreate } from "../../helps/dateformat";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { BsCalendarEvent, BsClock } from "react-icons/bs";

const EventItem = ({ event, onEventUpdate }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  console.log(user);
  const [isJoined, setIsJoined] = useState(false);
  const [author, setAuthor] = useState(null);

  const truncateText = (text, maxLength) => {
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  useEffect(() => {
    const fetchAuthor = async () => {
      if (user && event && Array.isArray(event.participants)) {
        console.log("User::", user);
        console.log("Event Participants::", event.participants);

        // Ensure user._id is treated as a string for comparison
        const userId = String(user._id);

        // Check if userId exists in participants array
        const isUserJoined = event.participants.some(
          (participant) => String(participant) === userId
        );

        setIsJoined(isUserJoined);
      } else {
        console.warn(
          "User, event or participants list is not properly defined"
        );
      }

      if (!event || !event.userCreate) {
        console.error("event.userCreate is undefined or null");
        return;
      }

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/user/${event.userCreate}`
        );
        if (response.data.success) {
          setAuthor(response.data.rs);
        } else {
          console.error("Failed to fetch author:", response.data);
        }
      } catch (error) {
        console.error("Error fetching author:", error);
      }
    };

    fetchAuthor();
  }, [event]);

  const formatDateTime = (date) => {
    if (!(date instanceof Date)) {
      date = new Date(date); // Convert to Date object if it's a string
    }
    const options = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false, // Use true if you prefer 12-hour format
    };
    return new Intl.DateTimeFormat("en-US", options).format(date);
  };

  const joinEvent = async () => {
    setIsJoined(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/v1/event/join/${event._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.data.success) {
        setIsJoined(false);
        console.error("Failed to join event:", response.data);
        toast.error("Failed to join event. Please try again.");
      } else {
        toast.success("Joined event successfully!");
        onEventUpdate();
      }
    } catch (error) {
      setIsJoined(false);
      console.error("Error joining event:", error);
      toast.error("Error joining event. Please try again.");
    }
  };

  const handleJoinEvent = () => {
    if (!isJoined) {
      joinEvent();
    }
  };

  // Kiểm tra trạng thái joined khi component mount và khi event thay đổi
  useEffect(() => {
    const checkJoinStatus = () => {
      if (user && event && Array.isArray(event.participants)) {
        const userId = String(user._id);
        const isUserJoined = event.participants.some(
          (participant) => String(participant) === userId
        );
        setIsJoined(isUserJoined);
      }
    };

    checkJoinStatus();
  }, [user, event]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full mx-auto bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden mb-10"
    >
      {/* Glass effect header */}
      <div className="relative h-48 bg-gradient-to-r from-[#6374AE] to-[#8B9AD3] p-8">
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>

        {/* Status Badge */}
        <div className="absolute top-6 right-6">
          <div
            className={`px-6 py-2 ${
              event.status === "active" ? "bg-emerald-500" : "bg-red-500"
            } text-white font-medium rounded-full shadow-lg backdrop-blur-sm
            border border-white/20 flex items-center gap-2`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                event.status === "active" ? "bg-emerald-200" : "bg-red-200"
              } animate-pulse`}
            ></span>
            {event.status || "none"}
          </div>
        </div>

        {/* Author Info */}
        <Link
          to={`/user/personalprofile/${author?._id}`}
          className="relative z-10"
        >
          <div className="flex items-center group">
            <div className="relative">
              <img
                src={
                  author?.avatar ||
                  "https://cellphones.com.vn/sforum/wp-content/uploads/2023/11/avatar-dep-60.jpg"
                }
                alt="Author"
                className="w-16 h-16 rounded-2xl object-cover ring-4 ring-white/30 group-hover:ring-white/50 transition-all duration-300"
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white"></div>
            </div>
            <div className="ml-4">
              <h1 className="text-white font-semibold text-xl group-hover:text-white/90 transition-colors">
                {author?.firstname || "Unknown Author"}
              </h1>
              <div className="flex items-center gap-4 text-white/80 text-sm mt-1">
                <div className="flex items-center gap-1">
                  <BsCalendarEvent />
                  <span>{formatDateTime(event.timeStart)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <BsClock />
                  <span>{formatDateTime(event.timeEnd)}</span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Content Section */}
      <div className="p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 hover:text-[#6374AE] transition-colors">
          {event.title || "No Title"}
        </h1>
        <p className="text-gray-600 leading-relaxed mb-6">
          {event.description || "No Description"}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-50 rounded-xl">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                className="text-[#6374AE]"
              >
                <path
                  opacity="0.4"
                  d="M17.9976 7.16C17.9376 7.15 17.8676 7.15 17.8076 7.16C16.4276 7.11 15.3276 5.98 15.3276 4.58C15.3276 3.15 16.4776 2 17.9076 2C19.3376 2 20.4876 3.16 20.4876 4.58C20.4776 5.98 19.3776 7.11 17.9976 7.16Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  opacity="0.4"
                  d="M16.9675 14.4399C18.3375 14.6699 19.8475 14.4299 20.9075 13.7199C22.3175 12.7799 22.3175 11.2399 20.9075 10.2999C19.8375 9.58992 18.3075 9.34991 16.9375 9.58991"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  opacity="0.4"
                  d="M5.96754 7.16C6.02754 7.15 6.09754 7.15 6.15754 7.16C7.53754 7.11 8.63754 5.98 8.63754 4.58C8.63754 3.15 7.48754 2 6.05754 2C4.62754 2 3.47754 3.16 3.47754 4.58C3.48754 5.98 4.58754 7.11 5.96754 7.16Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  opacity="0.4"
                  d="M6.9975 14.4399C5.6275 14.6699 4.1175 14.4299 3.0575 13.7199C1.6475 12.7799 1.6475 11.2399 3.0575 10.2999C4.1275 9.58992 5.6575 9.34991 7.0275 9.58991"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12.0001 14.63C11.9401 14.62 11.8701 14.62 11.8101 14.63C10.4301 14.58 9.33008 13.45 9.33008 12.05C9.33008 10.62 10.4801 9.46997 11.9101 9.46997C13.3401 9.46997 14.4901 10.63 14.4901 12.05C14.4801 13.45 13.3801 14.59 12.0001 14.63Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9.08997 17.7799C7.67997 18.7199 7.67997 20.2599 9.08997 21.1999C10.69 22.2699 13.31 22.2699 14.91 21.1999C16.32 20.2599 16.32 18.7199 14.91 17.7799C13.32 16.7199 10.69 16.7199 9.08997 17.7799Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div>
              <span className="text-2xl font-bold text-[#6374AE]">
                {event.participants.length}
              </span>
              <p className="text-gray-500 text-sm">Participants</p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleJoinEvent}
            disabled={isJoined}
            className={`px-8 py-3 rounded-xl font-medium text-base
              transition-all duration-300 relative overflow-hidden
              ${
                isJoined
                  ? "bg-gray-50 text-[#6374AE] border-2 border-[#6374AE]"
                  : "bg-gradient-to-r from-[#6374AE] to-[#8B9AD3] text-white shadow-lg hover:shadow-xl"
              }`}
          >
            <span
              className={`flex items-center gap-2 ${
                isJoined ? "opacity-75" : ""
              }`}
            >
              {isJoined ? (
                <>
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Joined</span>
                </>
              ) : (
                "Join Event"
              )}
            </span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default EventItem;
