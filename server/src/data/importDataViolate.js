const mongoose = require("mongoose");
const { posts } = require("./dataViolate");
const Post = require("../models/post"); // Giả sử bạn có model Post
const User = require("../models/user"); // Giả sử bạn có model User

require("dotenv").config();
const importData = async () => {
  try {
    // Kết nối đến MongoDB
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Lấy danh sách người dùng từ cơ sở dữ liệu
    const users = await User.find({});
    if (users.length === 0) {
      console.error("No users found in the database.");
      process.exit(1);
    }

    // Tạo các bài viết mới với idAuthor ngẫu nhiên từ danh sách người dùng
    const postsWithRandomAuthor = posts.map((post) => ({
      ...post,
      idAuthor: users[Math.floor(Math.random() * users.length)]._id, // Lấy id ngẫu nhiên từ danh sách người dùng
    }));

    // Lưu các bài viết vào cơ sở dữ liệu
    await Post.insertMany(postsWithRandomAuthor);

    console.log("Data imported successfully!");
    process.exit();
  } catch (error) {
    console.error("Error importing data:", error);
    process.exit(1);
  }
};

importData();
