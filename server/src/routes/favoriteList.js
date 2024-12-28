const router = require("express").Router();
const controller = require("../controllers/favoriteList");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

// Excercise Routes
router.put("/question/:qid", verifyAccessToken, controller.toggleQuestionFavorite);
router.put("/post/:pid", verifyAccessToken, controller.togglePostFavorite);
router.post("/", verifyAccessToken, controller.createFavoriteList);
router.put("/:lid/post/:pid", verifyAccessToken, controller.addPostId);
router.put("/:lid/question/:qid", verifyAccessToken, controller.addQuestionId);
router.get("/:lid", verifyAccessToken, controller.getFavoriteList);

module.exports = router;
