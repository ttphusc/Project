const router = require("express").Router();
const controller = require("../controllers/notification");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

// Excercise Routes
router.post("/:receiverId", verifyAccessToken, controller.createNotification);
router.get("/", verifyAccessToken, controller.getNotificationByUserId);
router.get("/all", verifyAccessToken, controller.getAllNotificationByUserId);
router.put("/:nid", verifyAccessToken, controller.updateNotification);

module.exports = router;
