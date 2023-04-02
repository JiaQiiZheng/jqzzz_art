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
const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");

const salt = bcrypt.genSaltSync(10);
const secret = "asdfe45we45w345wegw345werjktjwertkj";
const bucket = "jqzzz";
const showNumber = 20;

app.use(
  cors({ credentials: true, origin: `${process.env.REACT_APP_API_URL}` })
);
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(__dirname + "/uploads"));

var bodyParser = require("body-parser"); // Body Parser Middleware
bodyParser = {
  json: { limit: "100mb", extended: true },
  urlencoded: { limit: "100mb", extended: true },
};

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

async function DeleteFromS3(s3_fileName) {
  const client = new S3Client({
    region: "us-east-1",
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECERT_ACCESS_KEY,
    },
  });
  const command = new DeleteObjectCommand({
    Bucket: bucket,
    Key: s3_fileName,
  });
  await client.send(command);
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

const uploadMiddleware = multer({
  dest: "/tmp",
  limits: { fieldSize: 500 * 1024 * 1024 },
});

//quill image uploader
app.post(
  "/api/ql/image",
  uploadMiddleware.single("image"),
  async (req, res) => {
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
      const { title, summary, content, section } = req.body;
      const postDoc = await Post.create({
        title,
        summary,
        content,
        cover: url,
        author: info.id,
        section: section,
      });
      res.json(postDoc);
    });
  }
);

//section design
app.post(
  "/api/post/design",
  uploadMiddleware.single("file"),
  async (req, res) => {
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
      const { title, summary, content, section } = req.body;
      const postDoc = await Post.create({
        title,
        summary,
        content,
        cover: url,
        author: info.id,
        section: section,
      });
      res.json(postDoc);
    });
  }
);

app.put(
  "/api/post/design",
  uploadMiddleware.single("file"),
  async (req, res) => {
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
      const isAuthor =
        JSON.stringify(postDoc.author) === JSON.stringify(info.id);
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
  }
);

app.get("/api/post/design", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const currentUrlArray = req.url.split("/");
  const section_name = currentUrlArray[currentUrlArray.length - 1];
  // res.send(section_name);
  res.json(
    //find by the post type
    await Post.find({ section: section_name })
      .populate("author", ["username"])
      .sort({ createdAt: -1 })
      .limit(showNumber)
  );
});

app.get("/api/design/post/:id", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { id } = req.params;
  const postDoc = await Post.findById(id).populate("author", ["username"]);
  res.json(postDoc);
});

app.delete("/api/design/post/:id", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { id } = req.params;
  await Post.deleteOne({ _id: id });
});

//section programming
app.post(
  "/api/post/programming",
  uploadMiddleware.single("file"),
  async (req, res) => {
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
      const { title, summary, content, section } = req.body;
      const postDoc = await Post.create({
        title,
        summary,
        content,
        cover: url,
        author: info.id,
        section: section,
      });
      res.json(postDoc);
    });
  }
);

app.put(
  "/api/post/programming",
  uploadMiddleware.single("file"),
  async (req, res) => {
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
      const isAuthor =
        JSON.stringify(postDoc.author) === JSON.stringify(info.id);
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
  }
);

app.get("/api/post/programming", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const currentUrlArray = req.url.split("/");
  const section_name = currentUrlArray[currentUrlArray.length - 1];
  // res.send(section_name);
  res.json(
    //find by the post type
    await Post.find({ section: section_name })
      .populate("author", ["username"])
      .sort({ createdAt: -1 })
      .limit(showNumber)
  );
});

app.get("/api/programming/post/:id", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { id } = req.params;
  const postDoc = await Post.findById(id).populate("author", ["username"]);
  res.json(postDoc);
});

app.delete("/api/programming/post/:id", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { id } = req.params;
  const deletePost = await Post.findById(id);
  await Post.deleteOne({ _id: id });
  //delete profile from s3
  const deteleObjectArray = deletePost.cover.split("/");
  const deteleObjectName = deteleObjectArray[deteleObjectArray.length - 1];
  res.send(deteleObjectName);
  await DeleteFromS3(deteleObjectName);
});

//section exhibition
app.post(
  "/api/post/exhibition",
  uploadMiddleware.single("file"),
  async (req, res) => {
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
      const { title, summary, content, section } = req.body;
      const postDoc = await Post.create({
        title,
        summary,
        content,
        cover: url,
        author: info.id,
        section: section,
      });
      res.json(postDoc);
    });
  }
);

app.put(
  "/api/post/exhibition",
  uploadMiddleware.single("file"),
  async (req, res) => {
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
      const isAuthor =
        JSON.stringify(postDoc.author) === JSON.stringify(info.id);
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
  }
);

app.get("/api/post/exhibition", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const currentUrlArray = req.url.split("/");
  const section_name = currentUrlArray[currentUrlArray.length - 1];
  // res.send(section_name);
  res.json(
    //find by the post type
    await Post.find({ section: section_name })
      .populate("author", ["username"])
      .sort({ createdAt: -1 })
      .limit(showNumber)
  );
});

app.get("/api/exhibition/post/:id", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { id } = req.params;
  const postDoc = await Post.findById(id).populate("author", ["username"]);
  res.json(postDoc);
});

app.delete("/api/exhibition/post/:id", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { id } = req.params;
  const deletePost = await Post.findById(id);
  await Post.deleteOne({ _id: id });
  //delete profile from s3
  const deteleObjectArray = deletePost.cover.split("/");
  const deteleObjectName = deteleObjectArray[deteleObjectArray.length - 1];
  res.send(deteleObjectName);
  await DeleteFromS3(deteleObjectName);
});

//section computation
app.post(
  "/api/post/computation",
  uploadMiddleware.single("file"),
  async (req, res) => {
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
      const { title, summary, content, section } = req.body;
      const postDoc = await Post.create({
        title,
        summary,
        content,
        cover: url,
        author: info.id,
        section: section,
      });
      res.json(postDoc);
    });
  }
);

app.put(
  "/api/post/computation",
  uploadMiddleware.single("file"),
  async (req, res) => {
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
      const isAuthor =
        JSON.stringify(postDoc.author) === JSON.stringify(info.id);
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
  }
);

app.get("/api/post/computation", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const currentUrlArray = req.url.split("/");
  const section_name = currentUrlArray[currentUrlArray.length - 1];
  // res.send(section_name);
  res.json(
    //find by the post type
    await Post.find({ section: section_name })
      .populate("author", ["username"])
      .sort({ createdAt: -1 })
      .limit(showNumber)
  );
});

app.get("/api/computation/post/:id", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { id } = req.params;
  const postDoc = await Post.findById(id).populate("author", ["username"]);
  res.json(postDoc);
});

app.delete("/api/computation/post/:id", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { id } = req.params;
  await Post.deleteOne({ _id: id });
});

//section art
app.post("/api/post/art", uploadMiddleware.single("file"), async (req, res) => {
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
    const { title, summary, content, section } = req.body;
    const postDoc = await Post.create({
      title,
      summary,
      content,
      cover: url,
      author: info.id,
      section: section,
    });
    res.json(postDoc);
  });
});

app.put("/api/post/art", uploadMiddleware.single("file"), async (req, res) => {
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

app.get("/api/post/art", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const currentUrlArray = req.url.split("/");
  const section_name = currentUrlArray[currentUrlArray.length - 1];
  // res.send(section_name);
  res.json(
    //find by the post type
    await Post.find({ section: section_name })
      .populate("author", ["username"])
      .sort({ createdAt: -1 })
      .limit(showNumber)
  );
});

app.get("/api/art/post/:id", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { id } = req.params;
  const postDoc = await Post.findById(id).populate("author", ["username"]);
  res.json(postDoc);
});

app.delete("/api/art/post/:id", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { id } = req.params;
  await Post.deleteOne({ _id: id });
});

if (process.env.API_PORT) {
  app.listen(process.env.API_PORT);
  console.log(`server started at port ${process.env.API_PORT}`);
}

module.exports = app;
