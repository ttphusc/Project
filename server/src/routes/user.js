const router = require("express").Router();
const controller = require("../controllers/user");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.get("/get", verifyAccessToken, controller.getUserByToken);
router.put("/block/:uid", verifyAccessToken, controller.blockUser);
router.get("/details/", verifyAccessToken, controller.getUserDetails);
router.get("/all/", verifyAccessToken, isAdmin, controller.getAllUser);
router.get("/", verifyAccessToken, isAdmin, controller.getUsers);
router.post("/register", controller.register);
router.post("/login/admin", controller.loginAdmin);
router.post("/login", controller.login);
router.get("/current", verifyAccessToken, controller.getCurrent);
router.get("/:uid", controller.getUser);
router.post("/refreshtoken", controller.refreshAccessToken);
router.get("/logout", controller.logout);
router.put("/personal/", verifyAccessToken, controller.updateUserPersonal);
router.put("/contact/", verifyAccessToken, controller.updateUserContact);
router.put("/password/", verifyAccessToken, controller.updateUserPassword);
router.put("/joinevent/:eid", verifyAccessToken, controller.joinEvent);
router.put("/following/:uid", verifyAccessToken, controller.following);
router.get("/:uid/followers", controller.getFollowersDetails);
router.get("/:uid/followings", controller.getFollowingDetails);
router.get("/:uid/posts", controller.getPostsDetails);
router.get("/:uid/questions", controller.getQuestionsDetails);
router.put("/:uid", verifyAccessToken, isAdmin, controller.updateUser);
router.delete("/:uid", verifyAccessToken, isAdmin, controller.deleteUser);
router.get("/verify-email/:token", controller.verifyEmail);
router.post("/forgot-password", controller.forgotPassword);
router.post("/reset-password/:token", controller.resetPassword);
router.get("/auth/google", controller.googleLogin);
router.get("/auth/google/callback", controller.googleCallback);
module.exports = router;

//CRUD | Create - Read - Update - Delete | Post - Get - Put - Delete

// create (post) + put - body // bao mat
// get + delete - query // ? & de bi lo
