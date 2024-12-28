const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var reportSchema = new mongoose.Schema(
  {
    idUser: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    idPost: {
      type: mongoose.Types.ObjectId,
      ref: "Post",
    },
    idQuestion: {
      type: mongoose.Types.ObjectId,
      ref: "Question",
    },
    reasonReport: {
      type: String,
    },
    status: {
      type: String,
      default: "Wait",
    },
    aiVerdict: {
      is_violation: Boolean,
      confidence_score: Number,
      violation_type: String,
      checked_at: Date,
    },
  },
  {
    timestamps: true,
  }
);

//Export the model
module.exports = mongoose.model("Report", reportSchema);
