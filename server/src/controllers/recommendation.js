const Post = require("../models/post");
const User = require("../models/user");
const { spawn } = require("child_process");
const path = require("path");
const asyncHandler = require("express-async-handler");

const getRecommendations = asyncHandler(async (req, res) => {
  const { _id } = req.user;

  try {
    const user = await User.findById(_id)
      .populate({
        path: "idFavoriteList",
        populate: {
          path: "idPost",
          populate: ["recipes", "excercises"],
        },
      })
      .populate("idAttributes");
    console.log(user);
    if (!user || !user.idAttributes) {
      return res.status(403).json({
        success: false,
        message: "User attributes are not defined",
      });
    }

    if (user.idAttributes.dietaryPreferences === "None") {
      return res.status(403).json({
        success: false,
        message: "You need to add attributes first",
      });
    }
    if (user.idAttributes.dietaryPreferences === "None") {
      return res.status(403).json({
        success: false,
        message: "You needs to add attributes first",
      });
    }
    if (
      !user.idFavoriteList?.idPost ||
      user.idFavoriteList?.idPost.length === 0
    ) {
      return res.status(403).json({
        success: false,
        message: "You needs to add post in your favorite list!",
      });
    }

    const allPosts = await Post.find().populate(["recipes", "excercises"]);

    const pythonScriptPath = path.join(
      __dirname,
      "../recommendation/recommend.py"
    );

    // Log để debug
    // console.log('Python path:', pythonScriptPath);
    // console.log('User data:', JSON.stringify(user));
    // console.log('Posts data:', JSON.stringify(allPosts));

    const pythonProcess = spawn("./venv/bin/python3", [
      path.join(__dirname, "../recommendation/recommend.py"),
      JSON.stringify({
        user: user.toJSON(),
        posts: allPosts.map((post) => post.toJSON()),
      }),
    ]);

    let recommendations = "";
    let errorOutput = "";

    pythonProcess.stdout.on("data", (data) => {
      recommendations += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      errorOutput += data.toString();
      console.error("Python error:", data.toString());
    });

    pythonProcess.on("close", (code) => {
      if (code !== 0) {
        console.error("Python script failed with code:", code);
        console.error("Error output:", errorOutput);
        return res.status(500).json({
          success: false,
          message: "Failed to generate recommendations",
          error: errorOutput,
        });
      }

      try {
        const parsedRecommendations = JSON.parse(recommendations);
        return res.json({
          success: true,
          recommendations: parsedRecommendations,
        });
      } catch (error) {
        console.error("Failed to parse recommendations:", error);
        return res.status(500).json({
          success: false,
          message: "Failed to parse recommendations",
          error: error.message,
        });
      }
    });
  } catch (error) {
    console.error("Controller error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = {
  getRecommendations,
};
