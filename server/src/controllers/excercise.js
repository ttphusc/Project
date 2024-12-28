const Excercise = require("../models/excercise");
const Post = require("../models/post");

const asyncHandler = require("express-async-handler");

const createExcercise = asyncHandler(async (req, res) => {
  if (Object.keys(req.body).length === 0) throw new Error("Missing inputs");
  const { pid } = req.params;
  if (!pid) throw new Error("Missing pid");
  const newExcercise = await Excercise.create(req.body);
  if (newExcercise) {
    await Post.findByIdAndUpdate(
      pid,
      { $push: { excercises: newExcercise._id } },
      { new: true }
    );
  }
  return res.status(200).json({
    success: newExcercise ? true : false,
    createExcercise: newExcercise
      ? newExcercise
      : "cannot create new excercise",
  });
});

const updateExcercise = asyncHandler(async (req, res) => {
  if (Object.keys(req.body).length === 0) throw new Error("Missing inputs");
  const { eid } = req.params;
  if (!eid) throw new Error("Missing eid");
  const updateExcercise = await Excercise.findByIdAndUpdate(eid, req.body, {new: true});
  return res.status(200).json({
    success: updateExcercise ? true : false,
    updateExcercise: updateExcercise
      ? updateExcercise
      : "cannot update new excercise",
  });
});

const getExcercise = asyncHandler(async (req, res) => {
  const { eid } = req.params;
  if (!eid) throw new Error("Missing eid");
  const response = await Excercise.findById(eid);
  return res.status(200).json({
    success: response ? true : false,
    excercise: response ? response : "cannot find new excercise",
  });
});

const getExcercises = asyncHandler(async (req, res) => {
  const response = await Excercise.find();
  return res.status(200).json({
    success: response ? true : false,
    excercise: response ? response : "cannot find new excercise",
  });
});

const deleteExcercise = asyncHandler(async (req, res) => {
  const { eid } = req.params;
  if (!eid) throw new Error("Missing eid");
  const response = Excercise.findByIdAndDelete(eid);
  if (response) {
    await Post.findByIdAndUpdate(
      eid,
      { $pull: { excercises: null } },
      { new: true }
    );
  }
});

module.exports = {
  createExcercise,
  deleteExcercise,
  updateExcercise,
  getExcercise,
  getExcercises,
};
