const ListMyRoomChat = require("../models/listMyRoomChat");
const RoomChat = require("../models/roomChat");
const Message = require("../models/message");
const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const { getIO } = require("../config/socket");
const createMessage = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { receiverId, idRoomChat } = req.params;
  const { message, image } = req.body;
  if (!_id || !receiverId || !message || !idRoomChat)
    throw new Error("missing input");
  const response = await Message.create({
    senderId: _id,
    receiverId,
    message,
    image,
  });
  if (response) {
    await RoomChat.findByIdAndUpdate(
      idRoomChat,
      { $push: { messages: response._id } },
      { new: true }
    );
    const io = getIO();
    io.emit("send_message", {
      receiverId,
      message,
      image,
      senderId: _id,
      idRoomChat,
    });
  }

  return res.json({
    success: response ? true : false,
    rs: response ? response : "Error when we want to create message",
  });
});

const getMessage = asyncHandler(async (req, res) => {
  const { idMessage } = req.params;
  if (!idMessage) throw new Error("missing input");
  const response = await Message.findById(idMessage);
  return res.json({
    success: response ? true : false,
    rs: response ? response : "Error when we want to get message",
  });
});
const deleteMessage = asyncHandler(async (req, res) => {
  const { idMessage } = req.params;
  if (!idMessage) throw new Error("missing input");
  const response = await Message.findByIdAndDelete(idMessage);
  return res.json({
    success: response ? true : false,
    rs: response ? response : "Error when we want to delete message",
  });
});
module.exports = {
  createMessage,
  getMessage,
  deleteMessage,
};
