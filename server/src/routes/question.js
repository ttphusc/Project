const router = require("express").Router();
const controller = require("../controllers/question");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

// Question Routes
router.post("/", verifyAccessToken, controller.createQuestion);
router.get("/", controller.getQuestions);
router.get("/all", verifyAccessToken, isAdmin, controller.getAllQuestions);
router.delete("/:qid", verifyAccessToken, controller.deleteQuestion);
router.get("/:qid", controller.getQuestion);

router.put("/comment/:qid", verifyAccessToken, controller.commentQuestion);
router.put("/like/:qid", verifyAccessToken, controller.likeQuestion);

router.put(
  "/comment/:qid/like/:cid",
  verifyAccessToken,
  controller.likeCommentQuestion
);
router.delete(
  "/admin/:qid",
  verifyAccessToken,
  isAdmin,
  controller.deleteQuestionAdmin
);
router.put("/:qid", verifyAccessToken, controller.updateQuestion);
router.get("/sort/questions", controller.getQuestionsSorting);
module.exports = router;
