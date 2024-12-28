const Notification = require("../models/notification");
const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const { getIO } = require("../config/socket");

const createNotification = asyncHandler(async (req, res) => {
  const { receiverId } = req.params;
  const senderId = req.user._id;

  if (!receiverId) throw new Error("Missing input");

  const recentNotification = await Notification.findOne({
    senderId,
    receiverId,
    createdAt: {
      $gte: new Date(Date.now() - 10 * 60 * 1000),
    },
  }).sort({ createdAt: -1 });

  const user = await User.findById(senderId);
  let response;

  if (recentNotification) {
    recentNotification.messageCount += 1;
    recentNotification.message = `${user.firstname} đã gửi ${recentNotification.messageCount} tin nhắn cho bạn`;
    response = await recentNotification.save();
  } else {
    response = await Notification.create({
      senderId,
      receiverId,
      message: `${user.firstname} đã gửi tin nhắn cho bạn`,
      messageCount: 1,
    });
  }

  // const populatedNotification = await response.populate(
  //   "senderId",
  //   "firstname avatar"
  // );

  const notifications = await Notification.find({
    receiverId,
    isRead: false,
  })
    .populate("senderId", "firstname avatar")
    .sort({ createdAt: -1 });

  const io = getIO();
  io.emit("send_notification", {
    receiverId,
    notifications: notifications,
  });
  console.log("notifications::", notifications);

  res.json({
    success: true,
    rs: notifications,
  });
});
const getNotificationByUserId = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  if (!_id) throw new Error("Missing input");
  // console.log(_id);
  const response = await Notification.find({
    receiverId: _id,
    isRead: false,
  })
    .populate("senderId", "firstname avatar")
    .sort({ createdAt: -1 });
  // console.log(response);
  res.json({
    success: response ? true : false,
    rs: response ? response : "Error when getting notifications",
  });
});
const getAllNotificationByUserId = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  if (!_id) throw new Error("Missing input");
  // console.log(_id);
  const response = await Notification.find({
    receiverId: _id,
  })
    .populate("senderId", "firstname avatar")
    .sort({ createdAt: -1 });
  // console.log(response);
  res.json({
    success: response ? true : false,
    rs: response ? response : "Error when getting notifications",
  });
});
const updateNotification = asyncHandler(async (req, res) => {
  const { nid } = req.params;
  if (!nid) throw new Error("Missing input");
  const notification = await Notification.findById(nid);
  notification.isRead = !notification.isRead;
  const response = await notification.save();
  if (response) {
    res.json({
      success: response ? true : false,
      rs: response ? response : "Error when we want to update notification",
    });
  }
});

module.exports = {
  createNotification,
  getNotificationByUserId,
  updateNotification,
  getAllNotificationByUserId,
};
