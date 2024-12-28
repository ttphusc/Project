const ListMyRoomChat = require("../models/listMyRoomChat");
const RoomChat = require("../models/roomChat");
const User = require("../models/user");
const asyncHandler = require("express-async-handler");

// const createRoomChat = asyncHandler(async (req, res) => {
//   const { _id } = req.user;
//   const { idUserEnd } = req.params;
  
//   if (!_id || !idUserEnd) throw new Error("missing input");

//   // Kiểm tra xem room chat giữa 2 user đã tồn tại chưa
//   const existingRoom = await RoomChat.findOne({
//     $or: [
//       { idUserStart: _id, idUserEnd: idUserEnd },
//       { idUserStart: idUserEnd, idUserEnd: _id }
//     ]
//   });

//   if (existingRoom) {
//     return res.json({
//       success: true,
//       rs: existingRoom,
//       message: "Room chat already exists"
//     });
//   }

//   // Tìm ListMyRoomChat của cả 2 user
//   const [userStartList, userEndList] = await Promise.all([
//     ListMyRoomChat.findOne({ idUser: _id }),
//     ListMyRoomChat.findOne({ idUser: idUserEnd })
//   ]);

//   if (!userStartList || !userEndList) {
//     throw new Error("One or both users don't have a chat list");
//   }

//   // Tạo room chat mới
//   const response = await RoomChat.create({
//     idUserStart: _id,
//     idUserEnd,
//   });

//   if (response) {
//     // Cập nhật ListMyRoomChat cho cả 2 user
//     await Promise.all([
//       ListMyRoomChat.findByIdAndUpdate(
//         userStartList._id,
//         { $push: { roomChats: response._id } },
//         { new: true }
//       ),
//       ListMyRoomChat.findByIdAndUpdate(
//         userEndList._id,
//         { $push: { roomChats: response._id } },
//         { new: true }
//       )
//     ]);
//   }

//   return res.json({
//     success: response ? true : false,
//     rs: response ? response : "Error when creating room chat",
//     message: response ? "Room chat created successfully" : "Failed to create room chat"
//   });
// });

const createRoomChat = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { idUserEnd } = req.params;
  
  if (!_id || !idUserEnd) throw new Error("missing input");

  // Kiểm tra xem room chat giữa 2 user đã tồn tại chưa
  const existingRoom = await RoomChat.findOne({
    $or: [
      { idUserStart: _id, idUserEnd: idUserEnd },
      { idUserStart: idUserEnd, idUserEnd: _id }
    ]
  });

  if (existingRoom) {
    return res.json({
      success: true,
      rs: existingRoom,
      message: "Room chat already exists"
    });
  }

  // Kiểm tra và tạo ListMyRoomChat nếu chưa tồn tại
  let [userStartList, userEndList] = await Promise.all([
    ListMyRoomChat.findOne({ idUser: _id }),
    ListMyRoomChat.findOne({ idUser: idUserEnd })
  ]);

  // Tạo ListMyRoomChat cho user start nếu chưa có
  if (!userStartList) {
    userStartList = await ListMyRoomChat.create({
      idUser: _id,
      roomChats: []
    });
    
    // Cập nhật reference trong User model
    await User.findByIdAndUpdate(_id, {
      idListMyRoomChat: userStartList._id
    });
  }

  // Tạo ListMyRoomChat cho user end nếu chưa có  
  if (!userEndList) {
    userEndList = await ListMyRoomChat.create({
      idUser: idUserEnd,
      roomChats: []
    });

    // Cập nhật reference trong User model
    await User.findByIdAndUpdate(idUserEnd, {
      idListMyRoomChat: userEndList._id
    });
  }

  // Tạo room chat mới
  const response = await RoomChat.create({
    idUserStart: _id,
    idUserEnd,
  });

  if (response) {
    // Cập nhật ListMyRoomChat cho cả 2 user
    await Promise.all([
      ListMyRoomChat.findByIdAndUpdate(
        userStartList._id,
        { $push: { roomChats: response._id } },
        { new: true }
      ),
      ListMyRoomChat.findByIdAndUpdate(
        userEndList._id,
        { $push: { roomChats: response._id } },
        { new: true }
      )
    ]);
  }

  return res.json({
    success: response ? true : false,
    rs: response ? response : "Error when creating room chat",
    message: response ? "Room chat created successfully" : "Failed to create room chat"
  });
});
const getRoomChat = asyncHandler(async (req, res) => {
  const { idRoomChat } = req.params;
  if (!idRoomChat) throw new Error("missing input");
  
  const response = await RoomChat.findById(idRoomChat)
    .populate({
      path: 'messages',
      options: { sort: { createdAt: 1 } },
      populate: [
        {
          path: 'senderId',
          select: 'firstname lastname avatar email'
        },
        {
          path: 'receiverId',
          select: 'firstname lastname avatar email'
        }
      ]
    })
    .populate('idUserStart', 'firstname lastname avatar email')
    .populate('idUserEnd', 'firstname lastname avatar email');

  return res.json({
    success: response ? true : false,
    rs: response ? response : "Error when we want to get room chat",
  });
});
const deleteRoomChat = asyncHandler(async (req, res) => {
  const { idRoomChat } = req.params;
  if ( !idRoomChat) throw new Error("missing input");
  const response = await RoomChat.findByIdAndDelete(idRoomChat);
  return res.json({
    success: response ? true : false,
    rs: response ? response : "Error when we want to delete list my room chat",
  });
});
module.exports = {
    createRoomChat,
    getRoomChat,
    deleteRoomChat,
};
