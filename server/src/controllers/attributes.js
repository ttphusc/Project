const Attributes = require("../models/attributes");
const post = require("../models/post");
const User = require("../models/user");

const asyncHandler = require("express-async-handler");

const createAttributes = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const {
    weight,
    height,
    sleepHours,
    activityLevel,
    dietaryPreferences,
    heathCondition,
    stressLevel,
    fitnessExperience,
    exercisePreferences,
    fitnessGoal,
  } = req.body;
  // if (
  //   !weight ||
  //   !height ||
  //   !sleepHours ||
  //   !activityLevel ||
  //   !dietaryPreferences ||
  //   !heathCondition ||
  //   !stressLevel ||
  //   !fitnessExperience ||
  //   !exercisePreferences ||
  //   !fitnessGoal
  // )
  //   throw new Error("Missing input");
  const existingAttributes = await Attributes.findOne({ idUser: _id });
  if (existingAttributes) {
    return res.status(400).json({
      success: false,
      message: "Attributes already exist for this user.",
    });
  }

  const response = await Attributes.create({
    weight,
    height,
    sleepHours,
    activityLevel,
    dietaryPreferences,
    heathCondition,
    stressLevel,
    fitnessExperience,
    exercisePreferences,
    fitnessGoal,
    idUser: _id,
  });
  if (response) {
    await User.findByIdAndUpdate(
      _id,
      {
        $push: { idAttributes: response._id },
      },
      {
        new: true,
      }
    );
  }
  return res.json({
    success: response ? true : false,
    createAttributes: response ? response : "cannot create new attributes",
  });
});
// Update
const updateAttributes = asyncHandler(async (req, res) => {
  const { aid } = req.params;
  if (Object.keys(req.body).length === 0) throw new Error("Missing input");
  const response = await Attributes.findByIdAndUpdate(aid, req.body, {
    new: true,
  });
  return res.json({
    success: response ? true : false,
    updateAttributes: response ? response : "cannot update new Attribute",
  });
});

// Delete
const deleteAtrributes = asyncHandler(async (req, res) => {
  const { aid } = req.params;
  const { _id } = req.user;
  const attributes = await Attributes.findById(aid);
  if (!attributes) throw new Error("Attributes not found");
  const response = await Attributes.findByIdAndDelete(aid);
  if (response) {
    await User.findByIdAndUpdate(
      _id,
      { $pull: { idAttributes: aid } },
      { new: true }
    );
  }
  return res.json({
    success: response ? true : false,
    deleteAttributes: response ? response : "cannot delete Attribute",
  });
});

const getAttributes = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const response = await Attributes.findOne({ idUser: _id });
  return res.json({
    success: response ? true : false,
    attributes: response ? response : "cannot get Attribute",
  });
});

module.exports = {
  createAttributes,
  updateAttributes,
  deleteAtrributes,
  getAttributes,
};
