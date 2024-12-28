const router = require("express").Router();
const controller = require("../controllers/recipe");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

// Excercise Routes
router.post("/:pid", verifyAccessToken, controller.createRecipe);
router.get("/:rid", controller.getRecipe);
router.put("/:rid", verifyAccessToken, controller.updateRecipe);
router.delete("/:rid", verifyAccessToken, controller.deleteRecipe);
module.exports = router;
    