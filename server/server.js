const express = require("express");
require("dotenv").config();
const dbConnect = require("./src/config/dbconnect");
const initRoutes = require("./src/routes");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const { initSocket } = require("./src/config/socket");
const passport = require("passport");
require("./src/config/passport-google");
const helmet = require("helmet");
const app = express();
const server = http.createServer(app);
const { spawn } = require('child_process');
const pythonProcess = spawn('./venv/bin/python3', ['src/ai/moderation.py']);


app.use(helmet());
// Khởi tạo socket.io
initSocket(server);

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:4000"],
    credentials: true,
  })
);

app.use(passport.initialize());

// Routes
dbConnect();
initRoutes(app);

const port = process.env.PORT || 8080;
server.listen(port, () => {
  console.log("Server running on port " + port);
});

// -----------------------------------------------------------  TESTING WITH PHONE  -----------------------------------------------------------
// const express = require("express");
// require("dotenv").config();
// const dbConnect = require("./src/config/dbconnect");
// const initRoutes = require("./src/routes");
// const cookieParser = require("cookie-parser");
// const cors = require("cors");
// const http = require("http");
// const { Server } = require("socket.io");
// const { initSocket } = require("./src/config/socket");

// const app = express();
// const server = http.createServer(app);

// // Khởi tạo socket.io
// initSocket(server);

// // Middleware
// app.use(cookieParser());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(
//   cors({
//     origin: ["http://172.25.26.149:5173", "http://172.25.26.149:4000"], // Cập nhật với IP của máy tính
//     credentials: true,
//   })
// );

// // Routes
// dbConnect();
// initRoutes(app);

// const port = process.env.PORT || 8080; // Đặt cổng cố định
// server.listen(port, "0.0.0.0", () => {
//   console.log(`Server running on http://172.25.26.149:${port}`);
// });
