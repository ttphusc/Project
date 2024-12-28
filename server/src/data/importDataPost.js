const mongoose = require('mongoose');
const posts = require('../../../recommendation_system/data/post.data.js');
const User = require('../models/user');

// Sử dụng models đã định nghĩa sẵn
const Recipe = require('../models/recipe.js');
const Exercise = require('../models/excercise.js');
const Post = require('../models/post.js');

// Hàm import dữ liệu
async function importData() {
  try {
    // Kết nối database
    await mongoose.connect('mongodb://localhost:27017/fitnutritionhub');

    // Lấy danh sách user IDs từ database
    const users = await User.find({}, '_id');
    if (users.length === 0) {
      throw new Error('Không tìm thấy user nào trong database. Hãy import users trước.');
    }

    // Xóa dữ liệu cũ nếu cần
    await Promise.all([
      Recipe.deleteMany({}),
      Exercise.deleteMany({}),
      Post.deleteMany({})
    ]);

    // Import từng post
    for (let i = 0; i < posts.length; i++) {
      const postData = posts[i];
      // Chọn user ID theo index (lặp lại nếu hết users)
      const authorId = users[i % users.length]._id;

      // Tạo recipe mới
      const recipe = new Recipe({
        name: postData.recipes.name,
        ingredients: postData.recipes.ingredients,
        instructions: postData.recipes.instructions,
        cooktime: postData.recipes.cooktime,
        calories: postData.recipes.calories
      });
      await recipe.save();

      // Tạo exercise mới với schema phù hợp
      const exercise = new Exercise({
        name: postData.excercises.name,
        level: postData.excercises.level,
        equipment: postData.excercises.equipment,
        primaryMuscles: postData.excercises.primaryMuscles,
        secondaryMuscles: postData.excercises.secondaryMuscles,
        instructions: postData.excercises.instructions,
        category: 'strength'
      });
      await exercise.save();

      // Tạo post và liên kết với recipe, exercise và author
      const post = new Post({
        title: postData.title,
        content: postData.content,
        tags: postData.tags,
        recipes: [recipe._id],
        excercises: [exercise._id],
        state: 'published',
        idAuthor: authorId // Thêm ID của author
      });
      await post.save();

      // Cập nhật reference ngược lại
      exercise.idPost = post._id;
      await exercise.save();
      
      recipe.idPost = post._id;
      await recipe.save();

      // Cập nhật danh sách posts của user
      await User.findByIdAndUpdate(
        authorId,
        { $push: { posts: post._id } }
      );
    }

    console.log('Import dữ liệu thành công!');
    
  } catch (error) {
    console.error('Lỗi khi import:', error);
  } finally {
    mongoose.disconnect();
  }
}

// Chạy import
importData();