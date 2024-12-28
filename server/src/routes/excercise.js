const router = require("express").Router();
const controller = require("../controllers/excercise");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

// Excercise Routes
router.post("/:pid", verifyAccessToken, controller.createExcercise);
router.get("/:eid",controller.getExcercise);
router.put("/:eid", verifyAccessToken,controller.updateExcercise);
router.delete("/:eid", verifyAccessToken,controller.deleteExcercise);
module.exports = router;
