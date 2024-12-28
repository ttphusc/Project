const router = require("express").Router();
const controller = require("../controllers/roomChat");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

// Excercise Routes
router.post("/:idUserEnd", verifyAccessToken, controller.createRoomChat);
router.get("/:idRoomChat", verifyAccessToken,controller.getRoomChat);
router.delete("/:idRoomChat", verifyAccessToken, controller.deleteRoomChat);
module.exports = router;
