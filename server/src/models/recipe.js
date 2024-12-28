const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
  //   id: {
  //     type: String,
  //     required: true,
  //   },
  idPost: {
    type: mongoose.Types.ObjectId,
    ref: "Post",
  },
  name: {
    type: String,
    required: true,
  },
  source: {
    type: String,
  },
  preptime: {
    type: Number,
    default: 0,
  },
  waittime: {
    type: Number,
    default: 0,
  },
  cooktime: {
    type: Number,
    default: 0,
  },
  servings: {
    type: Number,
  },
  comments: {
    type: String,
  },
  calories: {
    type: Number,
  },
  fat: {
    type: Number,
  },
  satfat: {
    type: Number,
  },
  carbs: {
    type: Number,
  },
  fiber: {
    type: Number,
  },
  sugar: {
    type: Number,
  },
  protein: {
    type: Number,
  },
  instructions: {
    type: String,
    required: true,
  },
  ingredients: {
    type: [String],
    required: true,
  },
  tags: {
    type: [String],
  },
});

module.exports = mongoose.model("Recipe", recipeSchema);
