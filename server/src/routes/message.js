const router = require("express").Router();
const controller = require("../controllers/message");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

// Excercise Routes
router.post("/:idRoomChat/receiver/:receiverId", verifyAccessToken, controller.createMessage);
router.get("/:idRoomChat", verifyAccessToken, controller.getMessage);
router.delete("/:idRoomChat", verifyAccessToken, controller.deleteMessage);
module.exports = router;
