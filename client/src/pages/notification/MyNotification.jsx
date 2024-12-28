import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiBell, FiCheck } from "react-icons/fi";
import socket from "../../config/socket";

const MyNotification = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNotifications();

    socket.on("connect", () => {
      console.log("Socket connected");
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    socket.on("send_notification", (data) => {
      const userCurrent = JSON.parse(localStorage.getItem("user"));
      if (userCurrent?._id === data?.receiverId) {
        setNotifications((prev) => [data.notification, ...prev]);
      }
    });

    return () => {
      socket.off("send_notification");
      socket.off("connect");
      socket.off("connect_error");
    };
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/notification/all`,
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
    setLoading(false);
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/v1/notification/${notificationId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Cập nhật state local
      setNotifications((prev) =>
        prev.map((notif) =>
          notif._id === notificationId ? { ...notif, isRead: true } : notif
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8 bg-white p-6 rounded-2xl shadow-sm">
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-3 rounded-2xl shadow-lg">
            <FiBell className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              My Notifications
            </h1>
            <p className="text-gray-500 text-sm">
              Manage all your notifications
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl font-medium">
            {notifications.filter((n) => !n.isRead).length} unread
          </span>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
          <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">
            Loading notifications...
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification._id}
              className={`flex items-start gap-4 p-6 rounded-2xl border ${
                notification.isRead
                  ? "bg-white"
                  : "bg-gradient-to-r from-blue-50 to-indigo-50"
              } transition-all duration-300 hover:shadow-lg hover:transform hover:-translate-y-1`}
            >
              <div className="flex-shrink-0">
                <img
                  src={notification.senderId?.avatar || "/default-avatar.png"}
                  alt="Avatar"
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-md hover:shadow-xl transition-all duration-300"
                />
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-semibold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer">
                    {notification.senderId?.firstname || "Người dùng"}
                  </span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-sm text-gray-500">
                    {new Date(notification.createdAt).toLocaleString("vi-VN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <p
                  className={`text-base leading-relaxed ${
                    notification.isRead
                      ? "text-gray-600"
                      : "text-gray-900 font-medium"
                  }`}
                >
                  {notification.content}
                </p>
                <p className="text-sm text-gray-500">
                  {notification.message || "No additional message"}
                </p>
              </div>
              <button
                onClick={() => handleMarkAsRead(notification._id)}
                className={`flex-shrink-0 w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all duration-300 ${
                  notification.isRead
                    ? "border-green-500 bg-green-500 text-white shadow-green-200 shadow-lg"
                    : "border-blue-400 hover:border-blue-600 hover:scale-110"
                }`}
              >
                {notification.isRead && <FiCheck className="w-5 h-5" />}
              </button>
            </div>
          ))}

          {notifications.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl border">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                <FiBell className="w-12 h-12 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No notifications
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                You will receive notifications when there is new activity
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyNotification;
