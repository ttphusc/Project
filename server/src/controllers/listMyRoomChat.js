const ListMyRoomChat = require("../models/listMyRoomChat");
const User = require("../models/user");
const asyncHandler = require("express-async-handler");

const createListMyRoomChat = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  if (!_id) throw new Error("missing input");

  // Kiểm tra xem user đã có list chat chưa
  const existingList = await ListMyRoomChat.findOne({ idUser: _id });
  if (existingList) {
    return res.json({
      success: false,
      rs: existingList,
      message: "User already has a list chat"
    });
  }

  // Nếu chưa có, tạo mới list chat
  const response = await ListMyRoomChat.create({
    idUser: _id,
  });

  if (response) {
    // Cập nhật user với list chat mới
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      { 
        $set: { idListMyRoomChat: response._id } // Dùng $set thay vì $push
      },
      { 
        new: true,
        runValidators: true 
      }
    );

    if (!updatedUser) {
      // Nếu không cập nhật được user, xóa list chat vừa tạo
      await ListMyRoomChat.findByIdAndDelete(response._id);
      throw new Error("Failed to update user with new list chat");
    }
  }

  return res.json({
    success: response ? true : false,
    rs: response ? response : "Error when creating list chat",
    message: "New list chat created successfully"
  });
});

const getListMyRoomChat = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  if (!_id) throw new Error("missing input");
  
  const response = await ListMyRoomChat.findOne({ idUser: _id })
    .populate({
      path: 'roomChats',
      populate: [
        {
          path: 'idUserStart',
          select: 'firstname lastname avatar email'
        },
        {
          path: 'idUserEnd',
          select: 'firstname lastname avatar email'
        },
        {
          path: 'messages',
          options: { sort: { createdAt: 1 } },
          populate: [
            {
              path: 'senderId',
              select: 'firstname lastname avatar'
            },
            {
              path: 'receiverId',
              select: 'firstname lastname avatar'
            }
          ]
        }
      ]
    });

  return res.json({
    success: response ? true : false,
    rs: response ? response : "Error when we want to get list my room chat",
  });
});
const deleteListMyRoomChat = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const {lid} = req.params
  if (!_id || !lid) throw new Error("missing input");
  const response = await ListMyRoomChat.findByIdAndDelete(lid);
  if (response ){
    await User.findByIdAndUpdate(
      _id,
      { $pull: { idListMyRoomChat: response._id } },
      { new: true }
    );
  }
  return res.json({
    success: response ? true : false,
    rs: response ? response : "Error when we want to delete list my room chat",
  });
});
module.exports = {
  createListMyRoomChat,
  getListMyRoomChat,
  deleteListMyRoomChat,
};
