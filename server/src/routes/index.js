const { notFound, errHandler } = require("../middlewares/errorHandler");
const postRouter = require("./post");
const userRouter = require("./user");
const questionRouter = require("./question");
const excerciseRouter = require("./excercise");
const recipeRouter = require("./recipe");
const attributesRouter = require("./attributes");
const reportRouter = require("./report");
const eventRouter = require("./event");
const listFavoriteRouter = require("./favoriteList");
const search = require("./search");
const messageRouter = require("./message");
const roomChatRouter = require("./roomChat");
const listMyRoomChatRouter = require("./listMyRoomChat");
const notificationRouter = require("./notification");
const recommendationRouter = require("./recommendation");
const testRouter = require("./test.router");
const moderatorRouter = require("./autoModeration");
const initRoutes = (app) => {
  app.use("/api/v1/post", postRouter);
  app.use("/api/v1/question", questionRouter);
  app.use("/api/v1/user", userRouter);
  app.use("/api/v1/excercise", excerciseRouter);
  app.use("/api/v1/recipe", recipeRouter);
  app.use("/api/v1/attributes", attributesRouter);
  app.use("/api/v1/report", reportRouter);
  app.use("/api/v1/event", eventRouter);
  app.use("/api/v1/favoritelist", listFavoriteRouter);
  app.use("/api/v1/message", messageRouter);
  app.use("/api/v1/roomchat", roomChatRouter);
  app.use("/api/v1/listmyroomchat", listMyRoomChatRouter);
  app.use("/api/v1/recommendation", recommendationRouter);
  app.use("/api/v1/notification", notificationRouter);
  app.use("/api/v1/", search);
  app.use("/api/v1/test", testRouter);
  app.use("/api/v1/moderation", moderatorRouter);
  app.use(notFound);
  app.use(errHandler);
};

module.exports = initRoutes;
