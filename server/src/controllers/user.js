const User = require("../models/user");
const Event = require("../models/event");
const Question = require("../models/question");
const Post = require("../models/post");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const { getIO } = require("../config/socket");
const sgMail = require("@sendgrid/mail");
const passport = require("passport");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../middlewares/jwt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { sendVerificationEmail } = require("../utils/sendEmail");

const register = asyncHandler(async (req, res) => {
  const { email, password, firstname, phone } = req.body;
  if (!email || !password || !phone || !firstname) {
    return res.status(400).json({
      success: false,
      mes: "Missing inputs",
    });
  }
  const user = await User.findOne({ email });
  if (user) throw new Error("User already existed");
  else {
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 giờ

    const newUser = await User.create({
      ...req.body,
      verificationToken,
      verificationTokenExpires,
      isEmailVerified: false,
    });

    if (newUser) {
      const emailSent = await sendVerificationEmail(email, verificationToken);

      if (!emailSent) {
        return res.status(201).json({
          success: true,
          mes: "Register successful but failed to send verification email. Please contact support.",
        });
      }

      return res.status(201).json({
        success: true,
        mes: "Register successful. Please check your email to verify your account.",
      });
    }

    return res.status(400).json({
      success: false,
      mes: "Something went wrong during registration",
    });
  }
});
const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.params;

  const user = await User.findOne({
    verificationToken: token,
    verificationTokenExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({
      success: false,
      mes: "Invalid or expired verification token",
    });
  }

  user.isEmailVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpires = undefined;
  await user.save();

  return res.status(200).json({
    success: true,
    mes: "Email verified successfully. You can now login.",
  });
});

//refresh token -> cap moi access token
//access token -> xac thuc nguoi dung, quan quyeen nguoi dung
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      success: false, // Corrected
      mes: "Missing inputs", // Corrected
    });
  }
  //plain object
  const response = await User.findOne({ email });
  if (!response) {
    return res.status(400).json({
      success: false,
      mes: "User not found",
    });
  }
  if (response.isBlocked) {
    return res.status(400).json({
      success: false,
      mes: "User is blocked",
    });
  }
  if (!response.isEmailVerified) {
    return res.status(400).json({
      success: false,
      mes: "Please verify your email before logging in",
    });
  }
  const checkPassword = await response.isCorrectPassword(password);
  if (!checkPassword) {
    return res.status(400).json({
      success: false,
      mes: "Password is incorrect",
    });
  }
  if (response && checkPassword) {
    //tach password va role ra khoi response
    const { password, role, refreshToken, ...userData } = response.toObject();
    //tao accesstoken
    const accessToken = generateAccessToken(response._id, role);
    //tao refreshtoken
    const newRefreshToken = generateRefreshToken(response._id);
    // luu refresh token vao db
    await User.findByIdAndUpdate(
      response._id,
      { refreshToken: newRefreshToken },
      { new: true }
    );
    // luu refresh token vao cookie
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({
      success: true,
      accessToken,
      userData,
    });
  } else {
    throw new Error("Invalid credential");
  }
});

const getCurrent = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const user = await User.findById(_id).select("-refreshToken -password -role");
  return res.status(200).json({
    success: user ? true : false,
    rs: user ? user : "user not found",
  });
});

const getUser = asyncHandler(async (req, res) => {
  const { uid } = req.params;
  const user = await User.findById(uid).select("-refreshToken -password -role");
  return res.status(200).json({
    success: user ? true : false,
    rs: user ? user : "user not found",
  });
});
const getUserViewProfile = asyncHandler(async (req, res) => {
  const { uid } = req.params;
  const user = await User.findById(uid).select(
    "-refreshToken -password -role -phone -isBlocked -listfavorite -idAttributes"
  );
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  //lay token tu cookie
  const cookie = req.cookies;
  //check xem co token hay ko
  if (!cookie && !cookie.refreshToken)
    throw new Error("No refresh token in cookies");
  //check token co hop le hay khonng
  const rs = await jwt.verify(cookie.refreshToken, process.env.JWT_SECRET);
  const response = await User.findOne({
    _id: rs._id,
    refreshToken: cookie.refreshToken,
  });
  return res.status(200).json({
    success: response ? true : false,
    newAccessToken: response
      ? generateAccessToken(response._id, response.role)
      : "Refresh token not matched",
  });
});

const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie || !cookie.refreshToken)
    throw new Error("No refresh token in cookie");
  //xoa refresh token in db
  await User.findOneAndUpdate(
    { refreshToken: cookie.refreshToken },
    { refreshToken: "" },
    { new: true }
  );
  //xoa refresh token o cookie trinh duyet
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  return res.status(200).json({
    success: true,
    mes: "logout is done",
  });
});

const updateUserPersonal = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { firstname, lastname, gender, dob } = req.body;
  if (!_id) {
    return res.status(400).json({
      success: false,
      mes: "User ID is required",
    });
  }
  if (!firstname && !lastname && !gender && !dob) {
    return res.status(400).json({
      success: false,
      mes: "No fields to update",
    });
  }
  const updateFields = {};
  if (firstname) updateFields.firstname = firstname;
  if (lastname) updateFields.lastname = lastname;
  if (gender) updateFields.gender = gender;
  if (dob) updateFields.dob = dob;

  const updatedUser = await User.findByIdAndUpdate(_id, updateFields, {
    new: true,
  }).select("-password -refreshToken -role");

  if (!updatedUser) {
    return res.status(404).json({
      success: false,
      mes: "User not found",
    });
  }

  return res.status(200).json({
    success: true,
    mes: "User updated successfully",
    user: updatedUser,
  });
});

const updateUserContact = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { phone, address } = req.body;
  if (!_id) throw new Error("Require login");
  if (!phone && !address) throw new Error("Missing input");

  const response = await User.findByIdAndUpdate(
    _id,
    { phone, address },
    { new: true }
  ).select("-password -refreshToken -role");

  return res.status(200).json({
    message: response ? true : false,
    rs: response ? response : "Failed to updated user information",
  });
});

const updateUserPassword = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { oldPassword, newPassword } = req.body;

  if (!_id) throw new Error("Require login");
  if (!oldPassword && !newPassword) throw new Error("Missing input");

  const user = await User.findById(_id);
  if (!user) throw new Error("User not found");

  const ismatch = await bcrypt.compare(oldPassword, user.password);
  if (!ismatch) throw new Error("Password not match");

  user.password = newPassword;
  await user.save();

  return res.status(200).json({
    success: true,
    rs: "update password successful",
  });
});
const following = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { uid } = req.params;
  if (!uid) throw new Error("Missing Input");
  const user = await User.findById(uid);
  const isFollowed = user?.followers?.find((el) => el.toString() === _id);
  if (isFollowed) {
    const follower = await User.findByIdAndUpdate(
      uid,
      { $pull: { followers: _id } },
      { new: true }
    );
    const following = await User.findByIdAndUpdate(
      _id,
      { $pull: { followings: uid } },
      { new: true }
    );
    return res.json({
      success: follower ? true : false,
      follower: follower,
      following: following,
    });
  } else {
    const follower = await User.findByIdAndUpdate(
      uid,
      { $push: { followers: _id } },
      { new: true }
    );
    const following = await User.findByIdAndUpdate(
      _id,
      { $push: { followings: uid } },
      { new: true }
    );
    return res.json({
      success: follower ? true : false,
      follower: follower,
      following: following,
    });
  }
});

const joinEvent = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { eid } = req.params;
  if (!_id || !eid) throw new Error("Missing input");
  const event = await Event.findById(eid);
  const alreadyParticipanted = event?.participants?.find(
    (el) => el.toString() === _id
  );
  if (alreadyParticipanted) {
    const response = await Event.findByIdAndUpdate(
      eid,
      { $pull: { participants: _id } },
      { new: true }
    );
    return res.json({
      success: response ? true : false,
      rs: response,
    });
  } else {
    const response = await Event.findByIdAndUpdate(
      eid,
      { $push: { participants: _id } },
      { new: true }
    );
    return res.json({
      success: response ? true : false,
      rs: response,
    });
  }
});

const getUsers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const tags = req.query.tags;
  const search = req.query.search || "";
  const role = req.query.role; // Thêm dòng này để lấy role từ query string

  const query = {
    ...(tags && { tags: { $in: tags.split(",") } }),
    role: { $ne: "admin" },
    ...(role && { role: role }),
  };

  const { ObjectId } = require("mongodb");

  console.log(search);
  if (search) {
    let isObjectId = false;
    try {
      isObjectId =
        ObjectId.isValid(search) && new ObjectId(search).toString() === search;
    } catch (e) {
      isObjectId = false;
    }

    query.$or = [
      { firstname: { $regex: search, $options: "i" } },
      { lastname: { $regex: search, $options: "i" } },
    ];

    if (isObjectId) {
      query.$or.push({ _id: new ObjectId(search) });
    }
  }

  const response = await User.find(query)
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: -1 })
    .select("-password -refreshToken");

  const total = await User.countDocuments(query);
  const totalPages = Math.ceil(total / limit);

  return res.json({
    success: true,
    users: response,
    page,
    totalPages,
    totalUsers: total,
  });
});

const updateUser = asyncHandler(async (req, res) => {
  const { uid } = req.params;
  if (Object.keys(req.body).length === 0 || !uid)
    throw new Error("Missing input");

  const response = await User.findByIdAndUpdate(uid, req.body, {
    new: true,
  }).select("-password -refreshToken -role");

  return res.status(200).json({
    message: response ? true : false,
    rs: response ? response : "Failed to updated user",
  });
});

const deleteUser = asyncHandler(async (req, res) => {
  const { uid } = req.params;
  if (!uid) throw new Error("Missing input");

  const response = await User.findByIdAndDelete(uid);
  return res.status(200).json({
    message: response ? true : false,
    rs: response ? response : "Failed to deleted user",
  });
});

// const blockUser = asyncHandler(async (req, res) => {
//   const { uid } = req.params;
//   const { isBlocked } = req.body;
//   console.log(isBlocked);
//   if (!uid || isBlocked === undefined) throw new Error("Missing input");

//   const response = await User.findByIdAndUpdate(
//     uid,
//     { isBlocked: isBlocked },
//     { new: true }
//   );
//   return res.status(200).json({
//     message: response ? true : false,
//     rs: response ? response : "Failed to updated user",
//   });
// });

const getAllUser = asyncHandler(async (req, res) => {
  const response = await User.find().select(
    "-password -refreshToken -role -firstname -lastname -email -phone -address -certificate"
  );
  return res.status(200).json({
    message: response ? true : false,
    rs: response ? response : "Failed to updated user",
  });
});

const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      success: false, // Corrected
      mes: "Missing inputs", // Corrected
    });
  }
  //plain object
  const response = await User.findOne({ email });
  if (response.role !== "admin") {
    return res.status(400).json({
      success: false, // Corrected
      mes: "Require role admin", // Corrected
    });
  }

  if (response && (await response.isCorrectPassword(password))) {
    //tach password va role ra khoi response
    const { password, role, refreshToken, ...userData } = response.toObject();
    //tao accesstoken
    const accessToken = generateAccessToken(response._id, role);
    //tao refreshtoken
    const newRefreshToken = generateRefreshToken(response._id);
    // luu refresh token vao db
    await User.findByIdAndUpdate(
      response._id,
      { refreshToken: newRefreshToken },
      { new: true }
    );
    // luu refresh token vao cookie
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({
      success: true,
      accessToken,
      userData,
    });
  } else {
    throw new Error("Invalid credential");
  }
});

const getFollowersDetails = asyncHandler(async (req, res) => {
  const { uid } = req.params;

  // Find the user by ID and populate the followers field
  const user = await User.findById(uid).populate(
    "followers",
    "-password -refreshToken -role"
  );

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  return res.status(200).json({
    success: true,
    followers: user.followers,
  });
});

const getFollowingDetails = asyncHandler(async (req, res) => {
  const { uid } = req.params;

  const user = await User.findById(uid).populate(
    "followings",
    "-password -refreshToken -role"
  );

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  return res.status(200).json({
    success: true,
    followings: user.followings,
  });
});

const getQuestionsDetails = asyncHandler(async (req, res) => {
  const { uid } = req.params;

  // Find the user by ID and populate the questions field
  const user = await User.findById(uid).populate("questions");

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  return res.status(200).json({
    success: true,
    questions: user.questions,
  });
});
const getPostsDetails = asyncHandler(async (req, res) => {
  const { uid } = req.params;

  // Find the user by ID and populate the questions field
  const user = await User.findById(uid).populate("posts");

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  return res.status(200).json({
    success: true,
    posts: user.posts,
  });
});
const blockUser = asyncHandler(async (req, res) => {
  const { uid } = req.params;
  const { isBlocked } = req.body;

  if (!uid || isBlocked === undefined) throw new Error("Missing input");

  const response = await User.findByIdAndUpdate(
    uid,
    { isBlocked: isBlocked },
    { new: true }
  );

  if (response) {
    // Emit socket event khi block/unblock thành công
    const io = getIO();
    io.emit("userBlocked", {
      blockedUserId: uid,
      isBlocked: isBlocked,
      message: `User ${response.firstname} ${response.lastname} has been ${
        isBlocked ? "blocked" : "unblocked"
      }`,
    });
  }

  return res.status(200).json({
    success: response ? true : false,
    rs: response ? response : "Failed to update user",
  });
});
const getUserDetails = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const response = await User.findById(_id)
    .select("-password -refreshToken -role")
    .populate({
      path: "idAttributes",
      select:
        "weight height sleepHours activityLevel dietaryPreferences heathCondition stressLevel fitnessExperience fitnessGoal exercisePreferences",
    })
    .populate({
      path: "idFavoriteList",
      populate: [
        {
          path: "idPost",
          select:
            "title content createdAt updatedAt likes dislikes comments status idAuthor recipes excercises",
          populate: [
            {
              path: "idAuthor",
              select: "firstname lastname avatar",
            },
            {
              path: "recipes",
              select: "name instructions ingredients cooktime calories",
            },
            {
              path: "excercises",
              select:
                "name level equipment primaryMuscles secondaryMuscles instructions",
            },
          ],
        },
      ],
    });

  return res.status(200).json({
    success: response ? true : false,
    rs: response ? response : "Failed to get user details",
  });
});

// Endpoint để gửi email reset password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Email does not exist" });
    }

    // Tạo token reset password
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // Token hết hạn sau 1 giờ
    await user.save();

    // Gửi email với link reset password
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    const msg = {
      to: email,
      from: process.env.SENDGRID_FROM_EMAIL,
      subject: "Đặt lại mật khẩu",
      html: `
        <p>Bạn đã yêu cầu đặt lại mật khẩu.</p>
        <p>Click vào link sau để đặt lại mật khẩu:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>Link này sẽ hết hạn sau 1 giờ.</p>
      `,
    };

    await sgMail.send(msg);
    res.status(200).json({ message: "Email đặt lại mật khẩu đã được gửi" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Endpoint để reset password
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Token không hợp lệ hoặc đã hết hạn" });
    }

    // Cập nhật mật khẩu mới
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Đặt lại mật khẩu thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};
const googleLogin = passport.authenticate("google", {
  scope: ["profile", "email"],
});

const googleCallback = asyncHandler(async (req, res) => {
  passport.authenticate("google", async (err, user) => {
    if (err) {
      console.error("Google authentication error:", err);
      return res.redirect(`${process.env.CLIENT_URL}/signin?error=auth_failed`);
    }

    if (!user) {
      return res.redirect(`${process.env.CLIENT_URL}/signin?error=no_user`);
    }

    // Tạo token như login thông thường
    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);

    // Cập nhật refresh token
    await User.findByIdAndUpdate(user._id, { refreshToken }, { new: true });

    // Redirect về frontend với token
    res.redirect(
      `${process.env.CLIENT_URL}/auth/google/callback?` +
        `accessToken=${accessToken}&` +
        `userId=${user._id}`
    );
  })(req, res);
});
const getUserByToken = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const user = await User.findById(_id).select("-refreshToken -password -role");
  return res.status(200).json({
    success: user ? true : false,
    rs: user ? user : "user not found",
  });
});

module.exports = {
  register,
  login,
  getCurrent,
  logout,
  refreshAccessToken,
  getUser,
  updateUserPersonal,
  updateUserContact,
  updateUserPassword,
  getUserViewProfile,
  joinEvent,
  following,
  getUsers,
  updateUser,
  deleteUser,
  blockUser,
  getAllUser,
  loginAdmin,
  getFollowersDetails,
  getFollowingDetails,
  getPostsDetails,
  getQuestionsDetails,
  getUserDetails,
  verifyEmail,
  forgotPassword,
  resetPassword,
  googleLogin,
  googleCallback,
  getUserByToken,
};
