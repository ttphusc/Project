const FavoriteList = require("../models/favoriteList");
const User = require("../models/user");
const asyncHandler = require("express-async-handler");

const createFavoriteList = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  if (!_id) throw new Error("missing input");
  const response = await FavoriteList.create({
    idUser: _id,
  });
  if (response) {
    await User.findByIdAndUpdate(
      _id,
      { $push: { idFavoriteList: response._id } },
      { new: true }
    );
  }
  return res.json({
    success: response ? true : false,
    rs: response ? response : "Error when we want to create favorite list",
  });
});

const addPostId = asyncHandler(async (req, res) => {
  const { lid, pid } = req.params;
  if (!lid || !pid) throw new Error("Missing input");
  const response = await FavoriteList.findByIdAndUpdate(
    lid,
    { $push: { idPost: pid } },
    { new: true }
  );
  return res.json({
    success: response ? true : false,
    rs: response ? response : "Error when we want to add post to favorite list",
  });
});

const addQuestionId = asyncHandler(async (req, res) => {
  const { lid, qid } = req.params;
  if (!lid || !qid) throw new Error("Missing input");
  const response = await FavoriteList.findByIdAndUpdate(
    lid,
    { $push: { idQuestion: qid } },
    { new: true }
  );
  return res.json({
    success: response ? true : false,
    rs: response
      ? response
      : "Error when we want to add question to favorite list",
  });
});

const getFavoriteList = asyncHandler(async (req, res) => {
  const { lid } = req.params;
  if (!lid) throw new Error("Missing input");

  const response = await FavoriteList.findById(lid)
    .populate({
      path: 'idQuestion',
      select: 'title content createdAt updatedAt likes dislikes comments tags status idAuthor', 
      populate: {
        path: 'idAuthor',
        select: 'name avatar email'
      }
    })
    .populate({
      path: 'idPost',
      select: 'title content createdAt updatedAt likes dislikes comments status idAuthor',
      populate: {
        path: 'idAuthor',
        select: 'name avatar email'
      }
    })
    .populate({
      path: 'idUser',
      select: 'name avatar email'
    });

  if (response) {
    const sortedItems = [
      ...response.idQuestion.map(q => ({
        ...q.toObject(),
        type: 'question',
        createdAt: new Date(q.createdAt)
      })),
      ...response.idPost.map(p => ({
        ...p.toObject(),
        type: 'post',
        createdAt: new Date(p.createdAt)
      }))
    ].sort((a, b) => b.createdAt - a.createdAt);

    return res.json({
      success: true,
      rs: {
        // ...response.toObject(),
        sortedItems
      }
    });
  }

  return res.json({
    success: false,
    rs: "Không thể lấy danh sách yêu thích"
  });
});

const toggleQuestionFavorite = asyncHandler(async (req, res) => {
  const { qid } = req.params;
  const { _id } = req.user;
  
  if (!qid) throw new Error("Missing question ID");

  // Tìm danh sách yêu thích của user
  let favoriteList = await FavoriteList.findOne({ idUser: _id });

  // Nếu chưa có danh sách yêu thích, tạo mới
  if (!favoriteList) {
    favoriteList = await FavoriteList.create({
      idUser: _id,
      idQuestion: [qid]
    });
    
    await User.findByIdAndUpdate(
      _id,
      { $push: { idFavoriteList: favoriteList._id } },
      { new: true }
    );
  } else {
    // Kiểm tra xem câu hỏi đã có trong danh sách chưa
    const questionExists = favoriteList.idQuestion.includes(qid);
    
    if (questionExists) {
      // Nếu có rồi thì xóa đi
      favoriteList = await FavoriteList.findByIdAndUpdate(
        favoriteList._id,
        { $pull: { idQuestion: qid } },
        { new: true }
      );
    } else {
      // Nếu chưa có thì thêm vào
      favoriteList = await FavoriteList.findByIdAndUpdate(
        favoriteList._id,
        { $push: { idQuestion: qid } },
        { new: true }
      );
    }
  }

  return res.json({
    success: true,
    rs: favoriteList,
    isFavorited: favoriteList.idQuestion.includes(qid)
  });
});

const togglePostFavorite = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  const { _id } = req.user;
  
  if (!pid) throw new Error("Missing post ID");

  // Tìm danh sách yêu thích của user
  let favoriteList = await FavoriteList.findOne({ idUser: _id });

  // Nếu chưa có danh sách yêu thích, tạo mới
  if (!favoriteList) {
    favoriteList = await FavoriteList.create({
      idUser: _id,
      idPost: [pid]
    });
    
    await User.findByIdAndUpdate(
      _id,
      { $push: { idFavoriteList: favoriteList._id } },
      { new: true }
    );
  } else {
    // Kiểm tra xem bài post đã có trong danh sách chưa
    const postExists = favoriteList.idPost.includes(pid);
    
    if (postExists) {
      // Nếu có rồi thì xóa đi
      favoriteList = await FavoriteList.findByIdAndUpdate(
        favoriteList._id,
        { $pull: { idPost: pid } },
        { new: true }
      );
    } else {
      // Nếu chưa có thì thêm vào
      favoriteList = await FavoriteList.findByIdAndUpdate(
        favoriteList._id,
        { $push: { idPost: pid } },
        { new: true }
      );
    }
  }

  return res.json({
    success: true,
    rs: favoriteList,
    isFavorited: favoriteList.idPost.includes(pid)
  });
});

module.exports = {
  createFavoriteList,
  addPostId,
  addQuestionId,
  getFavoriteList,
  toggleQuestionFavorite,
  togglePostFavorite
};
