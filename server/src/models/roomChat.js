const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var roomChatSchema = new mongoose.Schema(
  {
    idUserStart: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    idUserEnd: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    messages: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Message",
      },
    ],
  },
  {
    timestamps: true,
  }
);

//Export the model
module.exports = mongoose.model("RoomChat", roomChatSchema);
