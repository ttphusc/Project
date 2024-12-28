const router = require("express").Router();
const controller = require("../controllers/autoModeration");
const {
  verifyAccessToken,
  isAdmin,
  isExpert,
} = require("../middlewares/verifyToken");
router.post("/moderate/:reportId", controller.handleAutomaticModeration);

module.exports = router;
