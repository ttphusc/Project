const router = require("express").Router();
const controller = require("../controllers/recommendation");
const {
  verifyAccessToken,
  isAdmin,
  isExpert,
} = require("../middlewares/verifyToken");

router.get("/", verifyAccessToken, controller.getRecommendations);

module.exports = router;
