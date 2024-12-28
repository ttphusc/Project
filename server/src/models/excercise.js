const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var excerciseSchema = new mongoose.Schema({
  idPost: {
    type: mongoose.Types.ObjectId,
    ref: "Post",
  },
  name: {
    type: String,
    required: true,
  },
  force: {
    type: String,
    enum: ["push", "pull", "hold"],
  },
  level: {
    type: String,
    required: true,
    enum: ["Beginner", "Intermediate", "Advanced"],
  },
  mechanic: {
    type: String,
    default: null,
  },
  equipment: {
    type: String,
    default: null,
  },
  primaryMuscles: {
    type: [String],
    required: true,
  },
  secondaryMuscles: {
    type: [String],
  },
  // instructions: {
  //   type: [String],
  //   required: true,
  // },
  instructions: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ["stretching", "strength", "cardio", "flexibility", "balance"],
  },
});

//Export the model
module.exports = mongoose.model("Excercise", excerciseSchema);
