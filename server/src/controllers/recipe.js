const Recipe = require("../models/recipe");
const Post = require("../models/post");

const asyncHandler = require("express-async-handler");

const createRecipe = asyncHandler(async (req, res) => {
  if (Object.keys(req.body).length === 0) throw new Error("Missing inputs");
  const { pid } = req.params;
  const newRecipe = await Recipe.create(req.body);
  if (newRecipe) {
    await Post.findByIdAndUpdate(
      pid,
      { $push: { recipes: newRecipe._id } },
      { new: true }
    );
  }
  return res.status(200).json({
    success: newRecipe ? true : false,
    createRecipe: newRecipe ? newRecipe : "cannot create new recipe",
  });
});

const updateRecipe = asyncHandler(async (req, res) => {
  if (Object.keys(req.body).length === 0) throw new Error("Missing inputs");
  const { rid } = req.params;
  const updateRecipe = await Recipe.findByIdAndUpdate(rid, req.body, {
    new: true,
    });
  return res.status(200).json({
    success: updateRecipe ? true : false,
    updateRecipe: updateRecipe ? updateRecipe : "cannot update recipe",
  });
});

const deleteRecipe = asyncHandler(async (req, res) => {
  const { rid } = req.params;
  if (!rid) throw new Error("Missing input");
  const deleteRecipe = await Recipe.findByIdAndDelete(rid);
  return res.status(200).json({
    success: deleteRecipe ? true : false,
    deleteRecipe: deleteRecipe ? deleteRecipe : "cannnot delete recipe",
  });
});

const getRecipe = asyncHandler(async (req, res) => {
  const { rid } = req.params;
  if (!rid) throw new Error("Missing input");
  const response = await Recipe.findById(rid);
  return res.status(200).json({
    success: response ? true : false,
    response: response ? response : "cannot get recipe",
  });
});

const getRecipes = asyncHandler(async (req, res) => {
  const response = await Recipe.find();
  return res.status(200).json({
    success: response ? true : false,
    response: response ? response : "cannot get recipes",
  });
});

module.exports = {
  createRecipe,
  getRecipe,
  getRecipes,
  deleteRecipe,
  updateRecipe,
};
