const router = require("express").Router();
const controller = require("../controllers/listMyRoomChat");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

// Excercise Routes
router.post("/", verifyAccessToken, controller.createListMyRoomChat);
router.get("/", verifyAccessToken,controller.getListMyRoomChat);
router.delete("/:lid", verifyAccessToken, controller.deleteListMyRoomChat);
module.exports = router;
