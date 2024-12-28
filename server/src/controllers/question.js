const question = require("../models/question");
const Question = require("../models/question");
const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");

const createQuestion = asyncHandler(async (req, res) => {
  const { title, content, tags } = req.body;
  const { _id } = req.user;
  console.log(title, content, _id);
  if (!_id || !title || !content) throw new Error("missing input");
  const slug = slugify(req.body.title);
  const response = await Question.create({
    title,
    content,
    slug,
    tags,
    idAuthor: _id,
  });

  if (response) {
    // Update the user to add the post ID to the posts array
    await User.findByIdAndUpdate(
      _id,
      { $push: { questions: response._id } },
      { new: true }
    );
  }
  return res.json({
    success: response ? true : false,
    createQuestion: response ? response : "cannot create new question",
  });
});

const updateQuestion = asyncHandler(async (req, res) => {
  const { qid } = req.params;
  if (Object.keys(req.body).length === 0) throw new Error("missing input");
  const response = await Question.findByIdAndUpdate(qid, req.body, {
    new: true,
  });
  return res.json({
    success: response ? true : false,
    updateQuestion: response ? response : "cannot update new Question",
  });
});

const getQuestions = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const tags = req.query.tags;
  const search = req.query.search || "";

  const query = {
    ...(tags && { tags: { $in: tags.split(",") } }),
  };

  const { ObjectId } = require("mongodb");

  // Check if search input is a valid ObjectId and build query
  if (search) {
    let isObjectId = false;
    try {
      isObjectId =
        ObjectId.isValid(search) && new ObjectId(search).toString() === search;
    } catch (e) {
      isObjectId = false;
    }

    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { content: { $regex: search, $options: "i" } },
    ];

    if (isObjectId) {
      query.$or.push({ _id: new ObjectId(search) });
    }
  }

  const response = await Question.find(query)
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: -1 });

  const total = await Question.countDocuments(query);
  const totalPages = Math.ceil(total / limit);

  return res.json({
    success: true,
    questions: response,
    page,
    totalPages,
    totalQuestions: total,
  });
});

const getQuestion = asyncHandler(async (req, res) => {
  const { qid } = req.params;
  const response = await Question.findByIdAndUpdate(
    qid,
    { $inc: { views: 1 } },
    { new: true }
  );
  return res.json({
    success: response ? true : false,
    rs: response,
  });
});

const deleteQuestion = asyncHandler(async (req, res) => {
  const { qid } = req.params;
  const { _id } = req.user;
  const question = await Question.findById(qid);
  console.log(question);
  if (!question) throw new Error("Question not found");
  const response = await Question.findByIdAndDelete(qid);

  if (response) {
    // Update the user to remove the post ID from the posts array
    await User.findByIdAndUpdate(
      _id,
      { $pull: { questions: qid } },
      { new: true }
    );
  }
  return res.json({
    success: response ? true : false,
    deletedQuestion: response ? response : "cannot delete post",
  });
});

// const uploadImagePost = asyncHandler(async(req, res) => {
//   const {pid} = req.params
//   if (!req.file) throw new Error('Missing input')
//   const response = await Blog.findByIdAndUpdate(pid, {image: req.file.path}, {new: true})
//   return res.json({
//       status:response ? true : false,
//       updatedBlog: response ? response : 'cannot upload image for blog'
//   })
// })
const commentQuestion = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { qid } = req.params;
  const { comment } = req.body;
  if (!qid || !comment) throw new Error("Missing inputs");
  const question = await Question.findById(qid);
  if (!question) throw new Error("Question not found!");

  if (comment.trim().length === 0) {
    return res
      .status(400)
      .json({ success: false, message: "Comment cannot be empty" });
  }
  const response = await Question.findByIdAndUpdate(
    qid,
    { $push: { comments: { postedBy: _id, comment: comment } } },
    { new: true }
  );

  return res.json({
    success: response ? true : false,
    rs: response,
  });
});

const repliesQuestion = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { qid, cid } = req.params;
  const { comment } = req.body;

  if (!qid || !cid || !_id || !comment) throw new Error("Missing input");

  const question = await Question.findById(qid);
  if (!question) throw new Error("Question not found");

  if (comment.trim().length === 0) {
    return res
      .status(400)
      .json({ success: false, message: "Comment cannot be empty " });
  }
  // Find the comment
  const commentIndex = question.comments.findIndex(
    (c) => c._id.toString() === cid
  );
  if (commentIndex === -1) {
    return res
      .status(404)
      .json({ success: false, message: "Comment not found" });
  }

  // Add the reply to the comment
  question.comments[commentIndex].replies.push({
    postedBy: _id,
    comment: comment,
  });

  // Save the post
  const updatedQuestion = await question.save();

  return res.status(200).json({
    success: true,
    message: "Reply added successfully",
    question: updateQuestion,
  });
});

const deleteComment = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { cid, qid } = req.params;

  if (!qid || !cid || !_id) throw new Error("Missing in put");

  const question = await Question.findById(pid);
  // Find the comment
  const commentIndex = question.comments.findIndex(
    (c) => c._id.toString() === cid
  );
  if (commentIndex === -1) {
    return res
      .status(404)
      .json({ success: false, message: "Comment not found" });
  }

  // Add the reply to the comment
  if (_id.toString() !== question.comments[commentIndex].postedBy.toString())
    throw new Error("You can not delete comment of another user");

  // Remove the comment
  question.comments.splice(commentIndex, 1);

  // Save the post
  const deletedQuestion = await question.save();
  return res.status(200).json({
    success: true,
    message: "Comment deleted successfully",
    question: deletedQuestion,
  });
});

const deleteReplies = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { qid, cid, rid } = req.params;
  if (!qid || !cid || !_id || !rid) throw new Error("Missing in put");

  const question = await Question.findById(pid);
  if (!question) throw new Error("Question not found");
  // Find the comment
  const commentIndex = question.comments.findIndex(
    (c) => c._id.toString() === cid
  );
  if (commentIndex === -1) {
    return res
      .status(404)
      .json({ success: false, message: "Comment not found" });
  }
  const replyIndex = question.comments[commentIndex].replies.findIndex(
    (c) => c._id.toString() === rid
  );
  if (replyIndex === -1) {
    return res
      .status(404)
      .json({ success: false, message: "Replies not found" });
  }

  // Add the reply to the comment
  if (
    _id.toString() !==
    question.comments[commentIndex].replies[replyIndex].postedBy.toString()
  )
    throw new Error("You can not delete comment of another user");

  // Remove the comment
  question.comments[commentIndex].replies.splice(replyIndex, 1);

  // Save the post
  const deletedQuestion = await post.save();
  return res.status(200).json({
    success: true,
    message: "Comment deleted successfully",
    question: deletedQuestion,
  });
});

const updateComment = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { qid, cid } = req.params;
  const { comment } = req.body;
  if (!qid || !cid || !comment || !_id) throw new Error("Missing input");
  if (comment.trim().length === 0 || comment.length > 500) {
    return res
      .status(400)
      .json({ success: false, message: "Comment cannot be empty or too long" });
  }
  const question = await Question.findById(qid);
  if (!question) throw new Error("Post not found");
  // Find the comment
  const commentIndex = question.comments.findIndex(
    (c) => c._id.toString() === cid
  );
  if (commentIndex === -1) {
    return res
      .status(404)
      .json({ success: false, message: "Comment not found" });
  }

  // Check if the user is the owner of the comment
  if (_id.toString() !== question.comments[commentIndex].postedBy.toString()) {
    return res.status(403).json({
      success: false,
      message: "You cannot update another user's comment",
    });
  }

  // Update the comment
  question.comments[commentIndex].comment = comment;

  // Save the post
  const updatedQuestion = await question.save();

  return res.status(200).json({
    success: true,
    message: "Comment updated successfully",
    question: updateQuestion,
  });
});

const updateReply = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { qid, cid, rid } = req.params;
  const { comment } = req.body;

  // Validate inputs
  if (!qid || !cid || !rid || !_id || !comment)
    return res.status(400).json({ success: false, message: "Missing input" });

  if (comment.trim().length === 0 || comment.length > 500)
    throw new Error("Comment cannot be empty or too long");

  // Find the post by id
  const question = await Question.findById(pid);
  if (!question) throw new Error("Post not found");

  // Find the comment within the post
  const commentIndex = question.comments.findIndex(
    (c) => c._id.toString() === cid
  );
  if (commentIndex === -1) {
    return res
      .status(404)
      .json({ success: false, message: "Comment not found" });
  }

  const commentObj = question.comments[commentIndex];

  // Find the reply within the comment
  const replyIndex = commentObj.replies.findIndex(
    (r) => r._id.toString() === rid
  );
  if (replyIndex === -1) {
    return res.status(404).json({ success: false, message: "Reply not found" });
  }

  const replyObj = commentObj.replies[replyIndex];

  // Check if the user is the owner of the reply
  if (_id.toString() !== replyObj.postedBy.toString()) {
    return res.status(403).json({
      success: false,
      message: "You cannot update another user's reply",
    });
  }

  // Update the reply
  replyObj.comment = comment;

  // Save the updated post
  const updatedQuestion = await post.save();

  return res.status(200).json({
    success: true,
    message: "Reply updated successfully",
    question: updatedQuestion,
  });
});

const addQuestionInFavorites = asyncHandler(async (req, res) => {
  const { qid } = req.params;
  const { _id } = req.user;
  if (!_id || !qid) throw new Error("missing input");
  // Tạo đối tượng mới để thêm vào listfavorite
  const newFavorite = {
    item: qid, // item là qid (ID của caau hoi)
    itemType: "Question", // Xác định loại là 'Question'
  };

  // Tìm user theo _id và đẩy mục yêu thích mới vào mảng listfavorite
  const response = await User.findByIdAndUpdate(
    _id,
    { $push: { listfavorite: newFavorite } }, // Sử dụng $push để thêm mục yêu thích
    { new: true } // Trả về document mới sau khi cập nhật
  );

  return res.json({
    success: response ? true : false,
    createQuestion: response ? response : "cannot add to favorites",
  });
});
const likeQuestion = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { qid } = req.params;
  if (!qid) throw new Error("Missing inputs");
  const question = await Question.findById(qid);
  const isLiked = question?.likes?.find((el) => el.toString() === _id);
  if (isLiked) {
    const response = await Question.findByIdAndUpdate(
      qid,
      { $pull: { likes: _id } },
      { new: true }
    );
    return res.json({
      success: response ? true : false,
      rs: response,
    });
  } else {
    const response = await Question.findByIdAndUpdate(
      qid,
      { $push: { likes: _id } },
      { new: true }
    );
    return res.json({
      success: response ? true : false,
      rs: response,
    });
  }
});

const likeCommentQuestion = asyncHandler(async (req, res) => {
  const { _id } = req.user; // User ID từ authentication
  const { qid, cid } = req.params; // Lấy Question ID và Comment ID từ request params

  // Kiểm tra đầu vào
  if (!qid || !cid || !_id) {
    return res.status(400).json({ success: false, message: "Missing input" });
  }

  // Tìm câu hỏi theo ID
  const question = await Question.findById(qid);
  if (!question) {
    return res
      .status(404)
      .json({ success: false, message: "Question not found" });
  }

  // Tìm bình luận theo ID
  const commentIndex = question.comments.findIndex(
    (c) => c._id.toString() === cid
  );
  if (commentIndex === -1) {
    return res
      .status(404)
      .json({ success: false, message: "Comment not found" });
  }

  // Kiểm tra nếu người dùng đã like bình luận chưa
  const likeIndex = question.comments[commentIndex].likes.findIndex(
    (like) => like.toString() === _id
  );

  if (likeIndex !== -1) {
    // Nếu người dùng đã like, thì xóa like
    question.comments[commentIndex].likes.splice(likeIndex, 1);
    await question.save();
    return res.status(200).json({
      success: true,
      message: "Like removed successfully",
      likesCount: question.comments[commentIndex].likes.length,
    });
  } else {
    // Nếu người dùng chưa like, thì thêm like
    question.comments[commentIndex].likes.push(_id);
    await question.save();
    return res.status(200).json({
      success: true,
      message: "Comment liked successfully",
      likesCount: question.comments[commentIndex].likes.length,
    });
  }
});
const deleteQuestionAdmin = asyncHandler(async (req, res) => {
  const { qid } = req.params;
  const question = await Question.findById(qid);
  if (!question) throw new Error("Question not found");
  const response = await Question.findByIdAndDelete(qid);

  if (response) {
    // Update the user to remove the post ID from the posts array
    await User.findByIdAndUpdate(
      response.idAuthor,
      { $pull: { questions: qid } },
      { new: true }
    );
  }
  return res.json({
    success: response ? true : false,
    deletedQuestion: response ? response : "cannot delete post",
  });
});

const getAllQuestions = asyncHandler(async (req, res) => {
  const response = await Question.find();
  return res.status(200).json({
    success: response ? true : false,
    questions: response ? response : "fail to get all posts",
  });
});
const getQuestionsSorting = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const sort = req.query.sort;
  console.log("sort:::", sort);
  let sortQuery = {};
  switch (sort) {
    case "newest":
      sortQuery = { createdAt: -1 }; // Sắp xếp giảm dần theo thời gian tạo
      break;
    case "oldest":
      sortQuery = { createdAt: 1 }; // Sắp xếp tăng dần theo thời gian tạo
      break;
    case "likiest":
      // Sắp xếp theo số lượng like (giảm dần)
      sortQuery = { "likes.length": -1, createdAt: -1 };
      break;
    case "viewest":
      // Sắp xếp theo số lượt xem (giảm dần)
      sortQuery = { views: -1, createdAt: -1 };
      break;
    default:
      sortQuery = { createdAt: -1 };
  }

  const response = await Question.find()
    .skip((page - 1) * limit)
    .limit(limit)
    .sort(sortQuery)
    .populate("likes") // Thêm populate để đếm số lượng likes chính xác
    .lean(); // Sử dụng lean() để tối ưu hiệu suất

  // Tính toán thêm số lượng likes cho mỗi bài post
  const questionsWithCounts = response.map((question) => ({
    ...question,
    likeCount: question.likes?.length || 0,
  }));

  const total = await Question.countDocuments();
  const totalPages = Math.ceil(total / limit);

  return res.json({
    success: true,
    questions: questionsWithCounts,
    page,
    totalPages,
    totalQuestions: total,
  });
});
//check create post
//check delete post
//check addpostInFavorite
module.exports = {
  createQuestion,
  updateQuestion,
  getQuestion,
  getQuestions,
  deleteQuestion,
  commentQuestion,
  repliesQuestion,
  deleteComment,
  deleteReplies,
  updateComment,
  updateReply,
  addQuestionInFavorites,
  likeQuestion,
  likeCommentQuestion,
  deleteQuestionAdmin,
  getAllQuestions,
  getQuestionsSorting,
};
