const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const users = require('../../../recommendation_system/data/user.data.js');

// Import models
const User = require('../models/user');
const Attributes = require('../models/attributes');
const FavoriteList = require('../models/favoriteList');

async function importData() {
  try {
    // Kết nối database
    await mongoose.connect('mongodb://localhost:27017/fitnutritionhub');

    // Xóa dữ liệu cũ
    await Promise.all([
      User.deleteMany({}),
      Attributes.deleteMany({}),
      FavoriteList.deleteMany({})
    ]);

    // Import từng user
    for (const userData of users) {
      // Tạo favorite list mới
      const favoriteList = new FavoriteList({
        idPost: [],
        idQuestion: []
      });
      await favoriteList.save();

      // Tạo user mới
      const user = new User({
        firstname: userData.firstname,
        lastname: userData.lastname,
        gender: userData.gender,
        email: userData.email,
        password: userData.password,
        phone: userData.phone,
        avatar: faker.image.avatar(),
        role: 'user',
        followers: [],
        followings: [],
        certificates: [],
        questions: [],
        posts: [],
        events: [],
        idFavoriteList: favoriteList._id
      });
      await user.save();

      // Cập nhật reference cho favorite list
      favoriteList.idUser = user._id;
      await favoriteList.save();

      // Tạo attributes mới
      const attributes = new Attributes({
        idUser: user._id,
        weight: userData.attributes.weight,
        height: userData.attributes.height,
        sleepHours: userData.attributes.sleepHours,
        activityLevel: userData.attributes.activityLevel,
        dietaryPreferences: userData.attributes.dietaryPreferences,
        heathCondition: userData.attributes.healthCondition || 'None',
        stressLevel: userData.attributes.stressLevel,
        fitnessExperience: userData.attributes.fitnessExperience,
        fitnessGoal: userData.attributes.fitnessGoal,
        exercisePreferences: userData.attributes.exercisePreferences
      });
      await attributes.save();

      // Cập nhật reference attributes cho user
      user.idAttributes = attributes._id;
      await user.save();
    }

    console.log('Import dữ liệu user thành công!');

  } catch (error) {
    console.error('Lỗi khi import:', error);
  } finally {
    mongoose.disconnect();
  }
}

// Chạy import
importData();
