const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
const { userData: users } = require("./data.js");
const { fetchHealthImages } = require("../utils/unsplash"); // Nhập hàm fetchHealthImages

// Import models
const User = require("../models/user");
const Attributes = require("../models/attributes");
const FavoriteList = require("../models/favoriteList");
const ListMyRoomChat = require("../models/listMyRoomChat");
const Recipe = require("../models/recipe");
const Exercise = require("../models/excercise");
const Post = require("../models/post");

async function importData() {
  try {
    await mongoose.connect("mongodb://localhost:27017/fitnutritionhub");
    const createdUsers = [];

    // Import users và attributes
    for (const userData of users) {
      // Tạo favorite list
      const favoriteList = new FavoriteList({
        idPost: [],
        idQuestion: [],
      });
      await favoriteList.save();

      // Tạo list room chat
      const listMyRoomChat = new ListMyRoomChat({
        roomChats: [],
      });
      await listMyRoomChat.save();

      // Tạo user với faker
      const user = new User({
        firstname: userData.firstname,
        lastname: userData.lastname,
        gender: userData.gender,
        email: faker.internet.email(), // Dùng faker cho email
        password: userData.password,
        phone: faker.phone.number("0#########"), // Dùng faker cho phone
        avatar: faker.image.avatar(), // Dùng faker cho avatar
        role: "user",
        followers: [],
        followings: [],
        certificates: [],
        questions: [],
        posts: [],
        events: [],
        idFavoriteList: favoriteList._id,
        idListMyRoomChat: listMyRoomChat._id,
      });
      await user.save();

      // Cập nhật references
      favoriteList.idUser = user._id;
      await favoriteList.save();

      listMyRoomChat.idUser = user._id;
      await listMyRoomChat.save();

      // Tạo attributes
      const attributes = new Attributes({
        idUser: user._id,
        height: userData.attributes.height,
        weight: userData.attributes.weight,
        sleepHours: userData.attributes.sleepHours,
        activityLevel: userData.attributes.activityLevel,
        dietaryPreferences: userData.attributes.dietaryPreferences,
        heathCondition: userData.attributes.healthCondition || "None",
        stressLevel: userData.attributes.stressLevel,
        fitnessExperience: userData.attributes.fitnessExperience,
        fitnessGoal: userData.attributes.fitnessGoal,
        exercisePreferences: userData.attributes.exercisePreferences,
      });
      await attributes.save();

      // Cập nhật attributes vào user
      user.idAttributes = attributes._id;
      await user.save();

      createdUsers.push(user);

      // Import posts cho user này
      if (userData.posts && userData.posts.length > 0) {
        for (const postData of userData.posts) {
          // Tạo recipe
          const recipe = new Recipe({
            name: postData.recipes.name,
            ingredients: postData.recipes.ingredients,
            instructions: postData.recipes.instructions,
            cooktime: postData.recipes.cooktime,
            calories: postData.recipes.calories,
          });
          await recipe.save();

          // Tạo exercise
          const exercise = new Exercise({
            name: postData.excercises.name,
            level: postData.excercises.level,
            equipment: postData.excercises.equipment,
            primaryMuscles: postData.excercises.primaryMuscles,
            secondaryMuscles: postData.excercises.secondaryMuscles,
            instructions: postData.excercises.instructions,
            category: "strength",
          });
          await exercise.save();

          // Lấy hình ảnh từ Unsplash
          const images = await fetchHealthImages(); // Lấy 5 hình ảnh
          const image =
            images.length > 0
              ? images[Math.floor(Math.random() * images.length)]
              : null; // Chọn ngẫu nhiên một hình ảnh

          // Tạo post
          const post = new Post({
            title: postData.title,
            content: postData.content,
            tags: postData.tags,
            recipes: [recipe._id],
            excercises: [exercise._id],
            state: "published",
            idAuthor: user._id,
            image, // Lưu hình ảnh vào post
          });
          await post.save();

          // Cập nhật references
          recipe.idPost = post._id;
          await recipe.save();

          exercise.idPost = post._id;
          await exercise.save();

          // Thêm post vào user
          await User.findByIdAndUpdate(user._id, {
            $push: { posts: post._id },
          });

          // Thêm post vào favorite list
          await FavoriteList.findByIdAndUpdate(favoriteList._id, {
            $push: { idPost: post._id },
          });
        }
      }
    }

    console.log("Import dữ liệu thành công!");
  } catch (error) {
    console.error("Lỗi khi import dữ liệu:", error);
  } finally {
    mongoose.disconnect();
  }
}

// Chạy import
importData();
