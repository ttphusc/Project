const router = require("express").Router();
const controller = require("../controllers/event");
const {
  verifyAccessToken,
  isAdmin,
  isExpert,
} = require("../middlewares/verifyToken");

router.get("/getcurrent/", verifyAccessToken, controller.getUserJoinedEvents);
router.get("/all/", verifyAccessToken, isAdmin, controller.getAllEvent);
router.get(
  "/expert/",
  verifyAccessToken,
  isExpert,
  controller.getEventByExpert
);
router.post("/", verifyAccessToken, controller.createEvent);
router.put("/:eid", verifyAccessToken, controller.updateEvent);
router.delete("/:eid", verifyAccessToken, controller.deleteEvent);
router.get("/:eid", verifyAccessToken, controller.getEvent);
router.get("/", controller.getEvents);
router.put("/join/:eid", verifyAccessToken, controller.joinEvent);
router.put(
  "/update/task/:eid",
  verifyAccessToken,
  controller.updateTasksInTodoList
);

router.put(
  "/:eid/todo/task",
  verifyAccessToken,
  controller.updateTaskCompletionStatus
);
router.put("/:eid/add-task", verifyAccessToken, controller.addTaskToTodoList);

module.exports = router;

// post: create
// put: update
// delete: xoa
// get: lay du lieu
