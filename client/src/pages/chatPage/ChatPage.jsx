import React, { useEffect, useState, useRef } from "react";
import socket from "../../config/socket";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./ChatPage.css";

const ChatPage = () => {
  const [listMyRoomChat, setListMyRoomChat] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { receiverId } = useParams();
  const [message, setMessage] = useState("");
  const user = JSON.parse(localStorage.getItem("user")) || null;
  const currentUserId = user?._id; // Dùng optional chaining để tránh lỗi
  const [imageUrl, setImageUrl] = useState("");
  const messagesEndRef = useRef(null); // Tạo ref để tham chiếu đến cuối danh sách tin nhắn

  // Kiểm tra và tạo ListMyRoomChat nếu chưa có
  const initializeListMyRoomChat = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/listmyroomchat/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        setListMyRoomChat(response.data.rs);
        // console.log("initializeListMyRoomChat::", response.data.rs);
      } else {
        fetchExistingList();
      }
    } catch (error) {
      fetchExistingList();
    }
  };

  const fetchExistingList = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/listmyroomchat/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        setListMyRoomChat(response.data.rs);
        // console.log("fetchExistingList::", response.data.rs);
      }
    } catch (error) {
      console.log("fetchExistingList::", error);
      setError("Không thể lấy danh sách chat");
    }
  };

  const fetchSelectedRoom = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/roomchat/${selectedRoomId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        setSelectedRoom(response.data.rs);
        console.log("fetchSelectedRoom::", response.data.rs);
      }
    } catch (error) {
      console.log("fetchSelectedRoom::", error);
      setError("Không thể lấy danh sách chat");
    }
  };

  useEffect(() => {
    initializeListMyRoomChat();
    // console.log(listMyRoomChat);
  }, []);

  // Hàm cuộn xuống cuối danh sách tin nhắn
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom(); // Cuộn xuống khi component được render
  }, [selectedRoom?.messages]); // Chạy khi có tin nhắn mới

  useEffect(() => {
    socket.on("send_message", (data) => {
      console.log("📌 Received message event:", data);

      if (
        data.receiverId === currentUserId ||
        data.senderId === currentUserId
      ) {
        setSelectedRoomId(data.idRoomChat);
        if (selectedRoomId) {
          fetchSelectedRoom();
        }
      }
    });

    return () => {
      socket.off("send_message");
    };
  }, [currentUserId, selectedRoomId]);

  useEffect(() => {
    if (selectedRoomId) {
      fetchSelectedRoom();
    }
  }, [selectedRoomId]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    // console.log("handleSendMessage::", message);
    // console.log("selectedRoom::", selectedRoom);
    try {
      const token = localStorage.getItem("accessToken");
      let idReceiver = "";
      if (selectedRoom.idUserEnd._id !== user._id) {
        idReceiver = selectedRoom.idUserEnd._id;
      } else {
        idReceiver = selectedRoom.idUserStart._id;
      }
      // console.log("imageUrl::", imageUrl);
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/message/${
          selectedRoom._id
        }/receiver/${idReceiver}`,
        {
          image: imageUrl,
          message: message,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        fetchSelectedRoom();
        setImageUrl("");
        setMessage("");
      }
      if (response.data.success) {
        try {
          const sendNotification = await axios.post(
            `${import.meta.env.VITE_API_URL}/api/v1/notification/${idReceiver}`,
            {
              receiverId: idReceiver,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        } catch (error) {
          console.log("handleSendMessage::", error);
        }
      }
    } catch (error) {
      console.log("handleSendMessage::", error);
    }
  };
  const handleSelectedRoom = async (room) => {
    setSelectedRoom(room);
    setSelectedRoomId(room._id);
  };
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/post/upload-image`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        setImageUrl(response.data.imageUrl);
        toast.success("Image uploaded successfully");
      }
    } catch (error) {
      toast.error("Failed to upload image");
      console.error(error);
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar - Danh sách room chat */}
      <div className="w-1/6 "></div>
      <div className="w-1/6  bg-white shadow-lg rounded-l-2xl">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-[#6374AE]">Messages</h2>
        </div>
        <div className="overflow-y-auto h-[calc(100vh-100px)]">
          {listMyRoomChat?.roomChats?.map((room) => (
            <div
              key={room._id}
              onClick={() => handleSelectedRoom(room)}
              className={`p-4 mx-2 my-2 rounded-xl cursor-pointer transition-all duration-200 
                ${
                  selectedRoom?._id === room._id
                    ? "bg-[#6374AE] shadow-lg transform scale-[1.02]"
                    : "hover:bg-gray-50"
                }`}
            >
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <img
                    src={
                      room.idUserEnd._id === user._id
                        ? room.idUserStart.avatar
                        : room.idUserEnd.avatar
                    }
                    alt="Avatar"
                    className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
                  />
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div className="flex-1">
                  <h3
                    className={`font-semibold ${
                      selectedRoom?._id === room._id
                        ? "text-white"
                        : "text-gray-800"
                    }`}
                  >
                    {`${
                      room.idUserEnd._id === user._id
                        ? room.idUserStart.firstname
                        : room.idUserEnd.firstname
                    } ${
                      room.idUserEnd._id === user._id
                        ? room.idUserStart.lastname
                        : room.idUserEnd.lastname
                    }`}
                  </h3>
                  <p
                    className={`text-sm truncate ${
                      selectedRoom?._id === room._id
                        ? "text-gray-200"
                        : "text-gray-500"
                    }`}
                  >
                    {room.messages?.[room.messages.length - 1]?.message ||
                      "Chưa có tin nhắn"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Khu vực chat chính */}
      <div className="flex-1  bg-white shadow-lg rounded-r-2xl">
        {selectedRoom ? (
          <div className="h-full flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img
                    src={
                      selectedRoom.idUserEnd._id === user._id
                        ? selectedRoom.idUserStart.avatar
                        : selectedRoom.idUserEnd.avatar
                    }
                    alt="Avatar"
                    className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
                  />
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      {`${
                        selectedRoom.idUserEnd._id === user._id
                          ? selectedRoom.idUserStart.firstname
                          : selectedRoom.idUserEnd.firstname
                      } ${
                        selectedRoom.idUserEnd._id === user._id
                          ? selectedRoom.idUserStart.lastname
                          : selectedRoom.idUserEnd.lastname
                      }`}
                    </h3>
                    <p className="text-sm text-green-500">Online</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {selectedRoom?.messages?.map((msg) => (
                <div
                  key={msg._id}
                  className={`flex ${
                    msg.senderId._id === user._id
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`flex ${
                      msg.senderId._id === user._id
                        ? "flex-row-reverse"
                        : "flex-row"
                    } items-end space-x-2`}
                  >
                    <img
                      src={msg.senderId.avatar}
                      alt="Avatar"
                      className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm"
                    />
                    <div
                      className={`max-w-[70%] ${
                        msg.senderId._id === user._id ? "mr-2" : "ml-2"
                      }`}
                    >
                      <div
                        className={`p-4 rounded-2xl shadow-sm ${
                          msg.senderId._id === user._id
                            ? "bg-[#6374AE] text-white rounded-br-none"
                            : "bg-gray-100 text-gray-800 rounded-bl-none"
                        }`}
                      >
                        {msg.message && (
                          <p className="text-sm mb-2">{msg.message}</p>
                        )}

                        {msg.image && msg.image !== "" && (
                          <div className="relative group">
                            <img
                              src={msg.image}
                              alt="Shared"
                              className="mt-2 rounded-lg w-full max-h-60 object-cover cursor-pointer transition-transform hover:scale-[1.02]"
                              onClick={() => window.open(msg.image, "_blank")}
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity rounded-lg flex items-center justify-center">
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-8 w-8 text-white"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                                  />
                                </svg>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      <div
                        className={`text-xs text-gray-400 mt-1 ${
                          msg.senderId._id === user._id
                            ? "text-right"
                            : "text-left"
                        }`}
                      >
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} /> {/* Thêm div này để cuộn xuống */}
            </div>

            <div className="p-6 border-t border-gray-200">
              {imageUrl && (
                <div className="mb-4 relative inline-block">
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="max-h-32 rounded-lg shadow-md"
                  />
                  <button
                    onClick={() => setImageUrl("")}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              )}
              <div className="flex items-center space-x-4">
                <label className="p-2 rounded-full hover:bg-gray-100 cursor-pointer transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </label>
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="flex-1 rounded-full border border-gray-200 px-6 py-3 focus:outline-none focus:border-[#6374AE] focus:ring-2 focus:ring-[#6374AE]/20"
                  placeholder="Enter your message..."
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <button
                  onClick={handleSendMessage}
                  className="p-3 bg-[#6374AE] text-white rounded-full hover:bg-[#4F5E99] transition-colors focus:outline-none focus:ring-2 focus:ring-[#6374AE]/50"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mb-4 text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <p className="text-xl font-medium">Select a chat to start</p>
          </div>
        )}
      </div>
      <div className="w-1/6 "></div>
    </div>
  );
};

export default ChatPage;
