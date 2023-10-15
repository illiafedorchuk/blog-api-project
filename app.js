const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");
const fs = require("fs");
const http = require("http");
const morgan = require("morgan");
const app = express();
const dotenv = require("dotenv");
const mysql = require("mysql2");
const db = require("./models");
const helmet = require("helmet");

dotenv.config({ path: "./config.env" });
const posterRouter = require("./routes/posterRouter.js");
const commentRouter = require("./routes/commentRouter.js");
const userRouter = require("./routes/userRouter.js");
const globalErrorHandler = require("./controllers/errorController.js");

// 1) MIDDLEWARES
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(globalErrorHandler);
app.use(cookieParser());
app.use(express.json());
app.use(express.json({ limit: "10kb" }));
app.use(helmet());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 2) ROUTE HANDLERS
app.use("/api/v1/posters", posterRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/users", userRouter);

// 4) START SERVER
db.sequelize.sync().then((req) => {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server started on port ${port}`);
  });
});

module.exports = app;
