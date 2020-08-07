const express = require("express");
require("./db/mongoose");
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
  console.log("Server is up on port" + port);
});

const jwt = require("jsonwebtoken");

const myFunction = async () => {
  const token = jwt.sign({ _id: "abc123" }, "thisisvladimirnodejs");
  console.log(token);
};

myFunction();

const Task = require("./models/task");
const User = require("./models/user");

const main = async () => {
  const task = await Task.findById("5f1025b4738f213344e21970");
  await task.populate("owner").execPopulate();
  console.log(task.owner);

  // const user = await User.findById("5f0f3aeb738f213344e2196d");
  // await user.populate("tasks").execPopulate();
  // console.log(user.tasks);
};

main();

const multer = require("multer");
const upload = multer({
  dest: "images",
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(doc|docx|pdf)$/)) {
      cb(new Error("Extension is not valid!!"));
    }
    cb(undefined, true);
  },
});

app.post(
  "/upload",
  upload.single("upload"),
  (req, res) => {
    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send(error.message);
  }
);
