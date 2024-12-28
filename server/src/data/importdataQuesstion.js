const mongoose = require("mongoose");
const questions = require("./data_question").questions;
const Question = require("../models/question");
const User = require("../models/user");
require("dotenv").config();

const importQuestions = async () => {
  try {
    // Kết nối đến MongoDB
    const mongoUri = process.env.MONGODB_URL; // Sử dụng MONGODB_URL
    if (!mongoUri) {
      throw new Error(
        "MONGODB_URL is not defined in the environment variables."
      );
    }

    await mongoose.connect(mongoUri);

    // Lấy danh sách người dùng từ DB
    const users = await User.find();

    // Kiểm tra xem có người dùng nào không
    if (users.length === 0) {
      console.log(
        "No users found. Please add users before importing questions."
      );
      return;
    }

    // Kiểm tra xem questions có phải là một mảng không
    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error("Questions data is not defined or is not an array.");
    }

    // Thêm câu hỏi vào DB
    const questionsWithAuthors = questions.map((question) => {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      return { ...question, idAuthor: randomUser._id }; // Gán idAuthor ngẫu nhiên
    });

    await Question.insertMany(questionsWithAuthors);
    console.log("Questions imported successfully!");

    // Đóng kết nối
    mongoose.connection.close();
  } catch (error) {
    console.error("Error importing questions:", error);
    mongoose.connection.close();
  }
};

importQuestions();
