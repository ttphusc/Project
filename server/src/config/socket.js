const socketIO = require("socket.io");

let io;

const initSocket = (server) => {
  io = socketIO(server, {
    cors: {
      origin: ["http://localhost:5173", "http://localhost:4000"],
      methods: ["GET", "POST", "PUT"],
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization"],
    },
    transports: ["websocket", "polling"],
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("join_chat", (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined their chat room`);
    });

    socket.on("send_message", (data) => {
      const { receiverId, message, senderId } = data;
      io.to(receiverId).emit("receive_message", {
        senderId,
        message,
        timestamp: new Date(),
      });
    });

    socket.on("send_notification", (data) => {
      const { receiverId } = data;
      if (!receiverId) {
        console.error("receiverId is missing in notification data");
        return;
      }
      io.to(receiverId).emit("receive_notification", {
        notifications: data.notifications,
      });
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
};

const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};

module.exports = {
  initSocket,
  getIO,
};
