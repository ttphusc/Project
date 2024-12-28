const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var listMyRoomChatSchema = new mongoose.Schema(
  {
    idUser: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    roomChats: [
      {
        type: mongoose.Types.ObjectId,
        ref: "RoomChat",
      },
    ],
  },
  {
    timestamps: true,
  }
);

//Export the model
module.exports = mongoose.model("ListMyRoomChat", listMyRoomChatSchema);
