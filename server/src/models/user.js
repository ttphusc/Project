const mongoose = require("mongoose"); // Erase if already required
const bcrypt = require("bcrypt");
const crypto = require("crypto");
// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
    },
    gender: {
      type: String,
      defaul: "male",
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    passwordChangedAt: {
      type: Date,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
    dob: {
      type: Date,
    },
    phone: {
      type: String,
      unique: true,
      sparse: true,
    },
    role: {
      type: String,
      default: "user",
    },
    address: String,
    isBlocked: {
      type: Boolean,
      default: false,
    },
    refreshToken: {
      type: String,
    },
    avatar: {
      type: String,
      default:
        "https://st.quantrimang.com/photos/image/2021/02/04/Hinh-nen-Quoc-Ky-VN-6.jpg",
    },
    followers: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
    followings: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
    certificates: [
      {
        type: String,
      },
    ],
    questions: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Question",
      },
    ],
    posts: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Post",
      },
    ],
    events: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Event",
      },
    ],
    idFavoriteList: {
      type: mongoose.Types.ObjectId,
      ref: "FavoriteList",
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    idAttributes: {
      type: mongoose.Types.ObjectId,
      ref: "Attributes",
    },
    idListMyRoomChat: {
      type: mongoose.Types.ObjectId,
      ref: "ListMyRoomChat",
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: String,
    verificationTokenExpires: Date,
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = bcrypt.genSaltSync(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods = {
  isCorrectPassword: async function (password) {
    return await bcrypt.compare(password, this.password);
  },
  createPasswordChangedToken: function () {
    const resetToken = crypto.randomBytes(32).toString("hex");
    this.passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    this.passwordResetExpires = Date.now() + 15 * 60 * 1000;
    return resetToken;
  },
};

//Export the model
module.exports = mongoose.model("User", userSchema);
