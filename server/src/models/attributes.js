const mongoose = require("mongoose");

var attributesSchema = new mongoose.Schema(
  {
    idUser: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    },
    weight: {
      type: Number,
      default: 70,
    },
    height: {
      type: Number,
      default: 170,
    },
    fitnessGoal: {
      type: String,
      // enum: ["Weight Loss", "Muscle Gain", "Maintenance", "Endurance"],
      default: "Maintenance",
    },
    activityLevel: {
      type: String,
      // enum: [
      //   "Sedentary",
      //   "Lightly Active",
      //   "Moderately Active",
      //   "Very Active",
      //   "Super Active",
      // ],
      default: "Moderately Active",
    },
    dietaryPreferences: {
      type: String,
      // enum: ["None", "Vegetarian", "Vegan", "Keto", "Paleo", "Mediterranean"],
      default: "None",
    },
    heathCondition: {
      type: String,
      // enum: [
      //   "None",
      //   "Hypertension",
      //   "Diabetes",
      //   "Heart Disease",
      //   "Asthma",
      //   "Other",
      // ],
      default: "None",
    },
    bmi: {
      type: Number,
    },
    sleepHours: {
      type: Number,
      default: 8,
    },
    dailyWaterIntake: {
      type: Number,
      default: 2,
    },
    stressLevel: {
      type: String,
      // enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    fitnessExperience: {
      type: String,
      // enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },
    exercisePreferences: {
      type: String,
      // enum: ["Cardio", "Strength Training", "Yoga", "Pilates", "Mixed"],
      default: "Mixed",
    },
  },
  {
    timestamps: true,
  }
);

attributesSchema.pre("save", function (next) {
  if (this.weight && this.height) {
    this.bmi = this.weight / (this.height / 100) ** 2;
  }
  next();
});

module.exports = mongoose.model("Attributes", attributesSchema);
