const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/User");
const Post = require("./models/Post");
const bcrypt = require("bcryptjs");
const app = express();
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config();
const multer = require("multer");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const salt = bcrypt.genSaltSync(10);
const secret = "asdfe45we45w345wegw345werjktjwertkj";
const bucket = "jqzzz";

app.use(
  cors({ credentials: true, origin: `${process.env.REACT_APP_API_URL}` })
);
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(__dirname + "/uploads"));

async function uploadToS3(path, originalFileName, mimetype) {
  const client = new S3Client({
    region: "us-east-1",
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECERT_ACCESS_KEY,
    },
  });
  const parts = originalFileName.split(".");
  const ext = parts[parts.length - 1];
  const newFileName = Date.now() + "." + ext;
  const command = new PutObjectCommand({
    Bucket: bucket,
    Body: fs.readFileSync(path),
    Key: newFileName,
    ContentType: mimetype,
    ACL: "public-read",
  });
  const data = await client.send(command);
  // console.log({ data });
  return `https://${bucket}.s3.amazonaws.com/${newFileName}`;
}

app.post("/api/register", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { username, password } = req.body;
  try {
    const userDoc = await User.create({
      username,
      password: bcrypt.hashSync(password, salt),
    });
    res.json(userDoc);
  } catch (e) {
    console.log(e);
    res.status(400).json(e);
  }
});

app.post("/api/login", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { username, password } = req.body;
  const userDoc = await User.findOne({ username });
  const passOk = bcrypt.compareSync(password, userDoc.password);
  if (passOk) {
    // logged in
    jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
      if (err) throw err;
      res.cookie("token", token).json({
        id: userDoc._id,
        username,
      });
    });
  } else {
    res.status(400).json("wrong credentials");
  }
});

app.get("/api/profile", (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, (err, info) => {
    if (err) throw err;
    res.json(info);
  });
});

app.post("/api/logout", (req, res) => {
  res.cookie("token", "").json("ok");
});

const uploadMiddleware = multer({ dest: "/tmp" });
app.post("/api/post", uploadMiddleware.single("file"), async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { path, originalname, mimetype } = req.file;
  // const parts = originalname.split(".");
  // const ext = parts[parts.length - 1];
  // const newPath = path + "." + ext;
  // fs.renameSync(path, newPath);
  const url = await uploadToS3(path, originalname, mimetype);

  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    const { title, summary, content } = req.body;
    const postDoc = await Post.create({
      title,
      summary,
      content,
      cover: url,
      author: info.id,
    });
    res.json(postDoc);
  });
});

app.put("/api/post", uploadMiddleware.single("file"), async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  // let newPath = null;
  if (req.file) {
    const { path, originalname, mimetype } = req.file;
    // const parts = originalname.split(".");
    // const ext = parts[parts.length - 1];
    // newPath = path + "." + ext;
    // fs.renameSync(path, newPath);
    var url = await uploadToS3(path, originalname, mimetype);
  }
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    const { id, title, summary, content } = req.body;
    const postDoc = await Post.findById(id);
    const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
    if (!isAuthor) {
      return res.status(400).json("you are not the author");
    }
    await postDoc.update({
      title,
      summary,
      content,
      cover: url ? url : postDoc.cover,
    });

    res.json(postDoc);
  });
});

app.get("/api/post", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  res.json(
    await Post.find()
      .populate("author", ["username"])
      .sort({ createdAt: -1 })
      .limit(20)
  );
});

app.get("/api/post/:id", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { id } = req.params;
  const postDoc = await Post.findById(id).populate("author", ["username"]);
  res.json(postDoc);
});

if (process.env.API_PORT) {
  app.listen(process.env.API_PORT);
}

module.exports = app;
//
