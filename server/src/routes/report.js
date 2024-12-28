const router = require("express").Router();
const controller = require("../controllers/report");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.get("/all", verifyAccessToken, isAdmin, controller.getAllReport);
router.post(
  "/question/:qid",
  verifyAccessToken,

  controller.createQuestionReport
);
router.post(
  "/post/:pid",
  verifyAccessToken,

  controller.createPostReport
);
router.get("/:rid", verifyAccessToken, isAdmin, controller.getReport);
router.delete("/:rid", verifyAccessToken, isAdmin, controller.deleteReport);
router.get("/", verifyAccessToken, isAdmin, controller.getReports);
router.put("/:rid", verifyAccessToken, isAdmin, controller.updateStatus);
router.get("/all", verifyAccessToken, isAdmin, controller.getAllReport);
module.exports = router;

// post: create
// put: update
// delete: xoa
// get: lay du lieu
