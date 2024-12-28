const router = require("express").Router();
const controller = require("../controllers/post");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");
const uploadCloud = require("../config/cloudinary");
const asyncHandler = require("express-async-handler");
// Post Routes
router.get("/all", verifyAccessToken, isAdmin, controller.getAllPosts);
router.post("/", verifyAccessToken, controller.createPost);
router.get("/", controller.getPosts);
router.get("/:pid", controller.getPost);
router.delete("/:pid", verifyAccessToken, controller.deletePost);
router.get("/:pid/post", controller.getPostById);
router.put("/like/:pid", verifyAccessToken, controller.likePost);
router.put("/dislike/:pid", verifyAccessToken, controller.dislikePost);

// Comment Routes
router.put("/comment/:pid", verifyAccessToken, controller.commentPost);
router.put("/comment/:pid/:cid", verifyAccessToken, controller.updateComment);
router.delete(
  "/comment/:pid/:cid",
  verifyAccessToken,
  controller.deleteComment
);

// Reply Routes
router.put(
  "/comment/:pid/reply/:cid",
  verifyAccessToken,
  controller.repliesPost
);
router.put(
  "/comment/:pid/reply/:cid/rep/:rid",
  verifyAccessToken,
  controller.updateReply
);
router.delete(
  "/comment/:pid/reply/:cid/rep/:rid",
  verifyAccessToken,
  controller.deleteReplies
);
router.get("/", controller.search);

router.delete(
  "/admin/:pid",
  verifyAccessToken,
  isAdmin,
  controller.deletePostAdmin
);

router.put("/:pid", verifyAccessToken, controller.updatePost);

router.post(
  "/upload-image",
  verifyAccessToken,
  uploadCloud.single("image"),
  controller.uploadImage
);

router.put("/block/:pid", verifyAccessToken, isAdmin, controller.blockPost);
router.put(
  "/block/post/:pid",
  verifyAccessToken,
  isAdmin,
  controller.blockPostAdmin
);
router.get("/sort/posts", controller.getPostsSorting);
module.exports = router;

// post: create // tạo
// put: update /// cập nhật
// get: view// lấy dữ liệu
// delete: delete// xóa
