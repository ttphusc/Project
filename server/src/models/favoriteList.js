const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var favoriteListSchema = new mongoose.Schema({
  idUser: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  idPost: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Post",
    },
  ],
  idQuestion: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Question",
    },
  ],
});

//Export the model
module.exports = mongoose.model("FavoriteList", favoriteListSchema);
