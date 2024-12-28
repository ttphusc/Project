const Post = require("../models/post");
const User = require("../models/user");
const Question = require("../models/question");
const Excercise = require("../models/excercise");
const Recipe = require("../models/recipe");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");

const createPost = asyncHandler(async (req, res) => {
  const { title, content, state, tags, image } = req.body;
  const { _id } = req.user;
  console.log(title, content, image);
  if (!_id || !title || !content || !tags) throw new Error("missing input");
  const slug = slugify(req.body.title);
  // if (!title || !content || !tags) throw new Error("missing input");
  // const response = await Post.create({ title, content, state, tags });
  const response = await Post.create({
    title,
    content,
    state,
    idAuthor: _id,
    slug,
    tags,
    image,
  });

  if (response) {
    await User.findByIdAndUpdate(
      _id,
      { $push: { posts: response._id } },
      { new: true }
    );
  }
  return res.json({
    success: response ? true : false,
    createPost: response ? response : "cannot create new post",
  });
});

const updatePost = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  if (Object.keys(req.body).length === 0) throw new Error("missing input");
  const response = await Post.findByIdAndUpdate(pid, req.body, { new: true });
  return res.json({
    success: response ? true : false,
    updatePost: response ? response : "cannot update new Post",
  });
});

const getPosts = asyncHandler(async (req, res) => {
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

  const response = await Post.find(query)
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: -1 });

  const total = await Post.countDocuments(query);
  const totalPages = Math.ceil(total / limit);

  return res.json({
    success: true,
    posts: response,
    page,
    totalPages,
    totalPosts: total,
  });
});

/**
 *
 * khi nguoi dung lai mot bai blog thi phai
 * 1. check xem nguoi do co dislike hay khong => bo diskike
 * 2. chekc truoc do co like hay ko => bo like
 *
 */
const likePost = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { pid } = req.params;
  if (!pid) throw new Error("Missing inputs");
  const post = await Post.findById(pid);
  const alreadyDisliked = post?.dislikes?.find((el) => el.toString() === _id);
  if (alreadyDisliked) {
    const response = await Post.findByIdAndUpdate(
      pid,
      { $pull: { dislikes: _id } },
      { new: true }
    );
    return res.json({
      success: response ? true : false,
      rs: response,
    });
  }
  const isLiked = post?.likes?.find((el) => el.toString() === _id);
  if (isLiked) {
    const response = await Post.findByIdAndUpdate(
      pid,
      { $pull: { likes: _id } },
      { new: true }
    );
    return res.json({
      success: response ? true : false,
      rs: response,
    });
  } else {
    const response = await Post.findByIdAndUpdate(
      pid,
      { $push: { likes: _id } },
      { new: true }
    );
    return res.json({
      success: response ? true : false,
      rs: response,
    });
  }
});

const dislikePost = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { pid } = req.params;
  if (!pid) throw new Error("Missing inputs");
  const post = await Post.findById(pid);
  const alreadyLiked = post?.likes?.find((el) => el.toString() === _id);
  if (alreadyLiked) {
    const response = await Post.findByIdAndUpdate(
      pid,
      { $pull: { likes: _id } },
      { new: true }
    );
    return res.json({
      success: response ? true : false,
      rs: response,
    });
  }
  const isDisliked = post?.dislikes?.find((el) => el.toString() === _id);
  if (isDisliked) {
    const response = await Post.findByIdAndUpdate(
      pid,
      { $pull: { dislikes: _id } },
      { new: true }
    );
    return res.json({
      success: response ? true : false,
      rs: response,
    });
  } else {
    const response = await Post.findByIdAndUpdate(
      pid,
      { $push: { dislikes: _id } },
      { new: true }
    );
    return res.json({
      success: response ? true : false,
      rs: response,
    });
  }
});

// const excludedFields = '-firstname -lastname'
const getPost = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  const post = await Post.findByIdAndUpdate(
    pid,
    { $inc: { views: 1 } },
    { new: true }
  )
    .populate("likes", "firstname lastname")
    .populate("dislikes", "firstname lastname");
  return res.json({
    success: post ? true : false,
    rs: post,
  });
});

const deletePost = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  const { _id } = req.user;
  const post = await Post.findById(pid);
  if (!post) throw new Error("Post not found");
  const response = await Post.findByIdAndDelete(pid);

  if (response) {
    // Update the user to remove the post ID from the posts array
    await User.findByIdAndUpdate(_id, { $pull: { posts: pid } }, { new: true });
    await Excercise.findByIdAndDelete(pid.excercises);
    await Recipe.findByIdAndDelete(response.recipes);
  }
  return res.json({
    success: response ? true : false,
    deletedPost: response ? response : "cannot delete post",
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
const commentPost = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { pid } = req.params;
  const { comment } = req.body;
  if (!pid || !comment) throw new Error("Missing inputs");
  const post = await Post.findById(pid);
  if (!post) throw new Error("Post not found!");

  if (comment.trim().length === 0 || comment.length > 500) {
    return res
      .status(400)
      .json({ success: false, message: "Comment cannot be empty or too long" });
  }
  const response = await Post.findByIdAndUpdate(
    pid,
    { $push: { comments: { postedBy: _id, comment: comment } } },
    { new: true }
  );

  return res.json({
    success: response ? true : false,
    rs: response,
  });
});

const repliesPost = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { pid, cid } = req.params;
  const { comment } = req.body;

  if (!pid || !cid || !_id || !comment) throw new Error("Missing in put");

  const post = await Post.findById(pid);
  if (!post) throw new Error("Post not found");

  if (comment.trim().length === 0 || comment.length > 500) {
    return res
      .status(400)
      .json({ success: false, message: "Comment cannot be empty or too long" });
  }
  // Find the comment
  const commentIndex = post.comments.findIndex((c) => c._id.toString() === cid);
  if (commentIndex === -1) {
    return res
      .status(404)
      .json({ success: false, message: "Comment not found" });
  }

  // Add the reply to the comment
  post.comments[commentIndex].replies.push({ postedBy: _id, comment: comment });

  // Save the post
  const updatedPost = await post.save();

  return res.status(200).json({
    success: true,
    message: "Reply added successfully",
    post: updatedPost,
  });
});

const deleteComment = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { cid, pid } = req.params;

  if (!pid || !cid || !_id) throw new Error("Missing in put");

  const post = await Post.findById(pid);
  // Find the comment
  const commentIndex = post.comments.findIndex((c) => c._id.toString() === cid);
  if (commentIndex === -1) {
    return res
      .status(404)
      .json({ success: false, message: "Comment not found" });
  }

  // Add the reply to the comment
  if (_id.toString() !== post.comments[commentIndex].postedBy.toString())
    throw new Error("You can not delete comment of another user");

  // Remove the comment
  post.comments.splice(commentIndex, 1);

  // Save the post
  const deletedPost = await post.save();
  return res.status(200).json({
    success: true,
    message: "Comment deleted successfully",
    post: deletedPost,
  });
});

const deleteReplies = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { pid, cid, rid } = req.params;
  if (!pid || !cid || !_id || !rid) throw new Error("Missing in put");

  const post = await Post.findById(pid);
  if (!post) throw new Error("Post not found");
  // Find the comment
  const commentIndex = post.comments.findIndex((c) => c._id.toString() === cid);
  if (commentIndex === -1) {
    return res
      .status(404)
      .json({ success: false, message: "Comment not found" });
  }
  const replyIndex = post.comments[commentIndex].replies.findIndex(
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
    post.comments[commentIndex].replies[replyIndex].postedBy.toString()
  )
    throw new Error("You can not delete comment of another user");

  // Remove the comment
  post.comments[commentIndex].replies.splice(replyIndex, 1);

  // Save the post
  const deletedPost = await post.save();
  return res.status(200).json({
    success: true,
    message: "Comment deleted successfully",
    post: deletedPost,
  });
});

const updateComment = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { pid, cid } = req.params;
  const { comment } = req.body;
  if (!pid || !cid || !comment || !_id) throw new Error("Missing input");
  if (comment.trim().length === 0 || comment.length > 500) {
    return res
      .status(400)
      .json({ success: false, message: "Comment cannot be empty or too long" });
  }
  const post = await Post.findById(pid);
  if (!post) throw new Error("Post not found");
  // Find the comment
  const commentIndex = post.comments.findIndex((c) => c._id.toString() === cid);
  if (commentIndex === -1) {
    return res
      .status(404)
      .json({ success: false, message: "Comment not found" });
  }

  // Check if the user is the owner of the comment
  if (_id.toString() !== post.comments[commentIndex].postedBy.toString()) {
    return res.status(403).json({
      success: false,
      message: "You cannot update another user's comment",
    });
  }

  // Update the comment
  post.comments[commentIndex].comment = comment;

  // Save the post
  const updatedPost = await post.save();

  return res.status(200).json({
    success: true,
    message: "Comment updated successfully",
    post: updatedPost,
  });
});

const updateReply = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { pid, cid, rid } = req.params;
  const { comment } = req.body;

  // Validate inputs
  if (!pid || !cid || !rid || !_id || !comment)
    return res.status(400).json({ success: false, message: "Missing input" });

  if (comment.trim().length === 0 || comment.length > 500)
    throw new Error("Comment cannot be empty or too long");

  // Find the post by id
  const post = await Post.findById(pid);
  if (!post) throw new Error("Post not found");

  // Find the comment within the post
  const commentIndex = post.comments.findIndex((c) => c._id.toString() === cid);
  if (commentIndex === -1) {
    return res
      .status(404)
      .json({ success: false, message: "Comment not found" });
  }

  const commentObj = post.comments[commentIndex];

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
  const updatedPost = await post.save();

  return res.status(200).json({
    success: true,
    message: "Reply updated successfully",
    post: updatedPost,
  });
});

const addPostInFavorites = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  const { _id } = req.user;
  if (!_id || !pid) throw new Error("missing input");
  // Tạo đối tượng mới để thêm vào listfavorite
  const newFavorite = {
    item: pid, // item là pid (ID của bài viết)
    itemType: "Post", // Xác định loại là 'Post'
  };

  // Tìm user theo _id và đẩy mục yêu thích mới vào mảng listfavorite
  const response = await User.findByIdAndUpdate(
    _id,
    { $push: { listfavorite: newFavorite } }, // Sử dụng $push để thêm mục yêu thích
    { new: true } // Trả về document mới sau khi cập nhật
  );

  return res.json({
    success: response ? true : false,
    createPost: response ? response : "cannot add to favorites",
  });
});

const search = asyncHandler(async (req, res) => {
  const { title } = req.body;
  const slug = slugify(title);
  if (!slug) throw new Error("Missing input");
  // Search for posts with matching slugs
  const posts = await Post.find({
    slug: { $regex: slug, $options: "i" },
  });

  // Search for questions with matching slugs
  const questions = await Question.find({
    slug: { $regex: slug, $options: "i" },
  });

  // If neither posts nor questions are found, return an error message
  if (!posts.length && !questions.length) {
    return res.status(404).json({
      success: false,
      message: "Cannot find any matching posts or questions",
    });
  }

  // Return successful response with both posts and questions
  return res.status(200).json({
    success: true,
    posts,
    questions,
  });
});

const deletePostAdmin = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  const post = await Post.findById(pid);
  if (!post) throw new Error("Post not found");
  const response = await Post.findByIdAndDelete(pid);

  if (response) {
    // Update the user to remove the post ID from the posts array
    await User.findByIdAndUpdate(
      response.idAuthor,
      { $pull: { posts: pid } },
      { new: true }
    );
  }
  return res.json({
    success: response ? true : false,
    deletedPost: response ? response : "cannot delete post",
  });
});

const getAllPosts = asyncHandler(async (req, res) => {
  const response = await Post.find();
  return res.status(200).json({
    success: response ? true : false,
    posts: response ? response : "fail to get all posts",
  });
});
const getPostById = asyncHandler(async (req, res) => {
  const { pid } = req.params;

  if (!pid) throw new Error("Missing post ID");

  const post = await Post.findById(pid)
    .populate({
      path: "recipes",
      select: "name instructions ingredients cooktime calories",
    })
    .populate({
      path: "excercises",
      select:
        "name level equipment primaryMuscles secondaryMuscles instructions",
    })
    .populate({
      path: "idAuthor",
      select: "firstname lastname avatar",
    });

  if (!post) {
    return res.status(404).json({
      success: false,
      message: "Không tìm thấy bài viết",
    });
  }

  return res.json({
    success: true,
    post,
  });
});

const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new Error("No file uploaded");
  }

  return res.json({
    success: true,
    imageUrl: req.file.path,
  });
});

const getPostsSorting = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const sort = req.query.sort || "newest";

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

  const response = await Post.find({
    $or: [
      { isBlocked: false }, // Bài viết không bị chặn
      { isBlocked: { $exists: false } }, // Bài viết không có trường isBlocked
    ],
  })
    .skip((page - 1) * limit)
    .limit(limit)
    .sort(sortQuery)
    .populate("likes") // Thêm populate để đếm số lượng likes chính xác
    .lean(); // Sử dụng lean() để tối ưu hiệu suất

  // Tính toán thêm số lượng likes cho mỗi bài post
  const postsWithCounts = response.map((post) => ({
    ...post,
    likeCount: post.likes?.length || 0,
  }));

  const total = await Post.countDocuments();
  const totalPages = Math.ceil(total / limit);

  return res.json({
    success: true,
    posts: postsWithCounts,
    page,
    totalPages,
    totalPosts: total,
  });
});

const blockPost = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  const post = await Post.findById(pid);
  if (!post) {
    return res.status(404).json({
      success: false,
      message: "Post not found",
    });
  }
  console.log(post.isBlocked);
  const state = !post.isBlocked;
  post.isBlocked = state;
  const updatedPost = await post.save();
  console.log(updatedPost);
  return res.status(200).json({
    success: true,
    post: updatedPost,
  });
});

const blockPostAdmin = asyncHandler(async (req, res) => {
  const { pid } = req.params;

  // Validate the post ID
  if (!mongoose.Types.ObjectId.isValid(pid)) {
    return res.status(400).json({
      success: false,
      message: "Invalid post ID",
    });
  }

  // Find the post by ID
  const post = await Post.findById(pid);
  if (!post) {
    return res.status(404).json({
      success: false,
      message: "Post not found",
    });
  }

  // Toggle the isBlocked state
  const previousState = post.isBlocked;
  post.isBlocked = !previousState;
  console.log(post);
  const updatedPost = await post.save();

  // Respond with the updated post
  return res.status(200).json({
    success: true,
    message: `Post ${post.isBlocked ? "blocked" : "unblocked"} successfully`,
    post: updatedPost,
    previousState,
  });
});

//check create post
//check delete post
//check addpostInFavorite
module.exports = {
  createPost,
  updatePost,
  getPost,
  likePost,
  dislikePost,
  getPosts,
  deletePost,
  commentPost,
  repliesPost,
  deleteComment,
  deleteReplies,
  updateComment,
  updateReply,
  addPostInFavorites,
  search,
  deletePostAdmin,
  getAllPosts,
  getPostById,
  uploadImage,
  getPostsSorting,
  blockPost,
  blockPostAdmin,
};
