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
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");

const salt = bcrypt.genSaltSync(10);
const secret = "asdfe45we45w345wegw345werjktjwertkj";
const bucket = "jqzzz";
const perPage = 999;

app.use(
  cors({ credentials: true, origin: `${process.env.REACT_APP_API_URL}` })
);

app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(__dirname + "/uploads"));

var bodyParser = require("body-parser"); // Body Parser Middleware
const { abort } = require("process");
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
    Metadata: { name: originalFileName },
    ContentType: mimetype,
    ACL: "public-read",
  });
  const data = await client.send(command);
  return `https://${bucket}.s3.amazonaws.com/${newFileName}`;
}

// upload to a specific folder in s3
async function uploadToS3_prefix(path, originalFileName, mimetype, prefix) {
  const client = new S3Client({
    region: "us-east-1",
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECERT_ACCESS_KEY,
    },
  });

  const parts = originalFileName.split(".");
  const ext = parts[parts.length - 1];
  const newFileName = prefix + Date.now() + "." + ext;
  const command = new PutObjectCommand({
    Bucket: bucket,
    Body: fs.readFileSync(path),
    Key: newFileName,
    Metadata: { name: originalFileName },
    ContentType: mimetype,
    ACL: "public-read",
  });
  const data = await client.send(command);
  return [
    newFileName,
    originalFileName,
    `https://${bucket}.s3.amazonaws.com/${newFileName}`,
  ];
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
  try {
    await client.send(command);
  } catch (error) {
    console.error(error);
  }
}

// solution_1
async function GetFromS3(s3_fileName) {
  const client = new S3Client({
    region: "us-east-1",
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECERT_ACCESS_KEY,
    },
  });
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: s3_fileName,
  });
  try {
    const response = await client.send(command);
    const originalFileName = response.Metadata.name;
    const getData_promise = response.Body.transformToString("base64");
    // const getData_promise = response.Body.transformToByteArray();
    const contentType = response.ContentType;
    return [getData_promise, contentType, originalFileName];
  } catch (error) {
    console.error(error);
  }
}

// solution_2
// async function GetFromS3(s3_fileName) {
//   const client = new S3Client({
//     region: "us-east-1",
//     credentials: {
//       accessKeyId: process.env.S3_ACCESS_KEY,
//       secretAccessKey: process.env.S3_SECERT_ACCESS_KEY,
//     },
//   });

//   return new Promise(async (resolve, reject) => {
//     const command = new GetObjectCommand({
//       Bucket: bucket,
//       Key: s3_fileName,
//     });
//     try {
//       const response = await client.send(command);
//       let responseDataChunks = [];
//       response.Body.once("error", (err) => reject(err));
//       response.Body.on("data", (chunk) => responseDataChunks.push(chunk));
//       response.Body.once("end", () => resolve(responseDataChunks.join("")));
//     } catch (error) {
//       return reject(error);
//     }
//   });
// }

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

//quill attachment uploader
app.post(
  "/api/ql/content/image",
  uploadMiddleware.single("image"),
  async (req, res) => {
    mongoose.connect(process.env.MONGO_URL);
    const { path, originalname, mimetype } = req.file;
    // const parts = originalname.split(".");
    // const ext = parts[parts.length - 1];
    // const newPath = path + "." + ext;
    // fs.renameSync(path, newPath);
    const url = await uploadToS3(path, originalname, mimetype);
    res.json(url);
  }
);

//quill attachment uploader
app.post(
  "/api/ql/attachment",
  uploadMiddleware.single("attachment"),
  async (req, res) => {
    mongoose.connect(process.env.MONGO_URL);
    const { path, originalname, mimetype } = req.file;
    // const parts = originalname.split(".");
    // const ext = parts[parts.length - 1];
    // const newPath = path + "." + ext;
    // fs.renameSync(path, newPath);
    const prefix = "attachment/";
    const [key, name, url] = await uploadToS3_prefix(
      path,
      originalname,
      mimetype,
      prefix
    );
    res.json(url);
  }
);

// global upload filepond attachment upload
app.post(
  "/api/filepond/upload",
  uploadMiddleware.single("file"),
  async (req, res) => {
    mongoose.connect(process.env.MONGO_URL);
    const { path, originalname, mimetype } = req.file;
    const prefix = "attachment/";
    const [key, name, url] = await uploadToS3_prefix(
      path,
      originalname,
      mimetype,
      prefix
    );
    res.json([key, name, url]);
  }
);

// delete files in filepond
app.delete("/api/filepond/delete/:id", async (req, res) => {
  const { id } = req.params;
  const key = `attachment/${id}`;
  await DeleteFromS3(key);
  res.json("deleted!");
});

// filepond load uploadedFiles from s3

// solution_1
app.get("/api/filepond/restore/:id", async (req, res) => {
  const { id } = req.params;
  const key = `attachment/${id}`;
  try {
    const [getData_promise, contentType, originalFileName] = await GetFromS3(
      key
    );
    // const data = await GetFromS3(key);
    getData_promise.then((data) => {
      res.send([data, contentType, originalFileName]);
    });
  } catch (error) {
    console.warn(error);
  }
});

// // solution_2
// app.get("/api/filepond/restore/:id", async (req, res) => {
//   const { id } = req.params;
//   const key = `attachment/${id}`;
//   try {
//     const data = await GetFromS3(key);
//     const blob = new Blob([data], { type: "image/png" });
//     res.type(blob.type);
//     blob.arrayBuffer().then((buffer) => res.send(Buffer.from(buffer)));
//   } catch (error) {
//     console.warn(error);
//   }
// });

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
      const { projectName, title, summary, content, section } = req.body;
      const postDoc = await Post.create({
        projectName,
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
      const { id, projectName, title, summary, content, uploadedFiles } =
        req.body;
      const postDoc = await Post.findById(id);
      const isAuthor =
        JSON.stringify(postDoc.author) === JSON.stringify(info.id);
      if (!isAuthor) {
        return res.status(400).json("you are not the author");
      }
      await postDoc.update({
        projectName,
        title,
        summary,
        content,
        cover: url ? url : postDoc.cover,
        uploadedFiles,
      });

      res.json(postDoc);
    });
  }
);

app.get("/api/post/design", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const currentUrlArray = req.url.split("/");
  const section_name =
    currentUrlArray[currentUrlArray.length - 1].split("?")[0];
  const page = req.query.page;
  // res.send(section_name);
  res.json(
    //find by the post type
    await Post.find({ section: section_name })
      .populate("author", ["username"])
      .sort({ createdAt: -1 })
      .limit(perPage)
      .skip(perPage * (page - 1))
  );
});

// get projectName list data
app.get("/api/post/design/projectNames", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const currentUrlArray = req.url.split("/");
  const section_name = currentUrlArray[currentUrlArray.length - 2];
  res.json(await Post.find({ section: section_name }).distinct("projectName"));
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

  //delete profile from s3
  const deletePost = await Post.findById(id);
  await Post.deleteOne({ _id: id });
  const deteleObjectArray = deletePost.cover.split("/");
  const deteleObjectName = deteleObjectArray[deteleObjectArray.length - 1];
  await DeleteFromS3(deteleObjectName);
  // res.send(deteleObjectName);

  //delete ql-image
  var m,
    urls = [],
    str = deletePost.content,
    rex = /<img[^>]+src="?([^"\s]+)">/g;
  while ((m = rex.exec(str))) {
    urls.push(m[1]);
  }
  for (var i = 0; i < urls.length; i++) {
    var ql_img_arr = urls[i].split("/");
    var delete_img_name = ql_img_arr[ql_img_arr.length - 1];
    await DeleteFromS3(delete_img_name);
  }
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
      const { projectName, title, summary, content, section } = req.body;
      const postDoc = await Post.create({
        projectName,
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
      const { id, projectName, title, summary, content } = req.body;
      const postDoc = await Post.findById(id);
      const isAuthor =
        JSON.stringify(postDoc.author) === JSON.stringify(info.id);
      if (!isAuthor) {
        return res.status(400).json("you are not the author");
      }
      await postDoc.update({
        projectName,
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
  const section_name =
    currentUrlArray[currentUrlArray.length - 1].split("?")[0];
  const page = req.query.page;
  // res.send(section_name);
  res.json(
    //find by the post type
    await Post.find({ section: section_name })
      .populate("author", ["username"])
      .sort({ createdAt: -1 })
      .limit(perPage)
      .skip(perPage * (page - 1))
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

  //delete profile from s3
  const deletePost = await Post.findById(id);
  await Post.deleteOne({ _id: id });
  const deteleObjectArray = deletePost.cover.split("/");
  const deteleObjectName = deteleObjectArray[deteleObjectArray.length - 1];
  await DeleteFromS3(deteleObjectName);
  // res.send(deteleObjectName);

  //delete ql-image
  var m,
    urls = [],
    str = deletePost.content,
    rex = /<img[^>]+src="?([^"\s]+)">/g;
  while ((m = rex.exec(str))) {
    urls.push(m[1]);
  }
  for (var i = 0; i < urls.length; i++) {
    var ql_img_arr = urls[i].split("/");
    var delete_img_name = ql_img_arr[ql_img_arr.length - 1];
    await DeleteFromS3(delete_img_name);
  }
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
      const { projectName, title, summary, content, section } = req.body;
      const postDoc = await Post.create({
        projectName,
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
      const { id, projectName, title, summary, content } = req.body;
      const postDoc = await Post.findById(id);
      const isAuthor =
        JSON.stringify(postDoc.author) === JSON.stringify(info.id);
      if (!isAuthor) {
        return res.status(400).json("you are not the author");
      }
      await postDoc.update({
        projectName,
        title,
        summary,
        content,
        cover: url ? url : postDoc.cover,
      });

      res.json(postDoc);
    });
  }
);

// get projectName list data
app.get("/api/post/exhibition/projectNames", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const currentUrlArray = req.url.split("/");
  const section_name = currentUrlArray[currentUrlArray.length - 2];
  res.json(await Post.find({ section: section_name }).distinct("projectName"));
});

app.get("/api/post/exhibition", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const currentUrlArray = req.url.split("/");
  const section_name =
    currentUrlArray[currentUrlArray.length - 1].split("?")[0];
  const page = req.query.page;
  // res.send(section_name);
  res.json(
    //find by the post type
    await Post.find({ section: section_name })
      .populate("author", ["username"])
      .sort({ createdAt: -1 })
      .limit(perPage)
      .skip(perPage * (page - 1))
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

  //delete profile from s3
  const deletePost = await Post.findById(id);
  await Post.deleteOne({ _id: id });
  const deteleObjectArray = deletePost.cover.split("/");
  const deteleObjectName = deteleObjectArray[deteleObjectArray.length - 1];
  await DeleteFromS3(deteleObjectName);
  // res.send(deteleObjectName);

  //delete ql-image
  var m,
    urls = [],
    str = deletePost.content,
    rex = /<img[^>]+src="?([^"\s]+)">/g;
  while ((m = rex.exec(str))) {
    urls.push(m[1]);
  }
  for (var i = 0; i < urls.length; i++) {
    var ql_img_arr = urls[i].split("/");
    var delete_img_name = ql_img_arr[ql_img_arr.length - 1];
    await DeleteFromS3(delete_img_name);
  }
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
      const { projectName, title, summary, content, section } = req.body;
      const postDoc = await Post.create({
        projectName,
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
      const { path, projectName, originalname, mimetype } = req.file;
      // const parts = originalname.split(".");
      // const ext = parts[parts.length - 1];
      // newPath = path + "." + ext;
      // fs.renameSync(path, newPath);
      var url = await uploadToS3(path, originalname, mimetype);
    }
    const { token } = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
      if (err) throw err;
      const { id, projectName, title, summary, content } = req.body;
      const postDoc = await Post.findById(id);
      const isAuthor =
        JSON.stringify(postDoc.author) === JSON.stringify(info.id);
      if (!isAuthor) {
        return res.status(400).json("you are not the author");
      }
      await postDoc.update({
        projectName,
        title,
        summary,
        content,
        cover: url ? url : postDoc.cover,
      });

      res.json(postDoc);
    });
  }
);

// get projectName list data
app.get("/api/post/computation/projectNames", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const currentUrlArray = req.url.split("/");
  const section_name = currentUrlArray[currentUrlArray.length - 2];
  res.json(await Post.find({ section: section_name }).distinct("projectName"));
});

app.get("/api/post/computation", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const currentUrlArray = req.url.split("/");
  const section_name =
    currentUrlArray[currentUrlArray.length - 1].split("?")[0];
  const page = req.query.page;
  // res.send(section_name);
  res.json(
    //find by the post type
    await Post.find({ section: section_name })
      .populate("author", ["username"])
      .sort({ createdAt: -1 })
      .limit(perPage)
      .skip(perPage * (page - 1))
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

  //delete profile from s3
  const deletePost = await Post.findById(id);
  await Post.deleteOne({ _id: id });
  const deteleObjectArray = deletePost.cover.split("/");
  const deteleObjectName = deteleObjectArray[deteleObjectArray.length - 1];
  await DeleteFromS3(deteleObjectName);
  // res.send(deteleObjectName);

  //delete ql-image
  var m,
    urls = [],
    str = deletePost.content,
    rex = /<img[^>]+src="?([^"\s]+)">/g;
  while ((m = rex.exec(str))) {
    urls.push(m[1]);
  }
  for (var i = 0; i < urls.length; i++) {
    var ql_img_arr = urls[i].split("/");
    var delete_img_name = ql_img_arr[ql_img_arr.length - 1];
    await DeleteFromS3(delete_img_name);
  }
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
    const { id, projectName, title, summary, content } = req.body;
    const postDoc = await Post.findById(id);
    const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
    if (!isAuthor) {
      return res.status(400).json("you are not the author");
    }
    await postDoc.update({
      projectName,
      title,
      summary,
      content,
      cover: url ? url : postDoc.cover,
    });

    res.json(postDoc);
  });
});

// get projectName list data
app.get("/api/post/art/projectNames", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const currentUrlArray = req.url.split("/");
  const section_name = currentUrlArray[currentUrlArray.length - 2];
  res.json(await Post.find({ section: section_name }).distinct("projectName"));
});

app.get("/api/post/art", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const currentUrlArray = req.url.split("/");
  const section_name =
    currentUrlArray[currentUrlArray.length - 1].split("?")[0];
  const page = req.query.page;
  // res.send(section_name);
  res.json(
    //find by the post type
    await Post.find({ section: section_name })
      .populate("author", ["username"])
      .sort({ createdAt: -1 })
      .limit(perPage)
      .skip(perPage * (page - 1))
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

  //delete profile from s3
  const deletePost = await Post.findById(id);
  await Post.deleteOne({ _id: id });
  const deteleObjectArray = deletePost.cover.split("/");
  const deteleObjectName = deteleObjectArray[deteleObjectArray.length - 1];
  await DeleteFromS3(deteleObjectName);
  // res.send(deteleObjectName);

  //delete ql-image
  var m,
    urls = [],
    str = deletePost.content,
    rex = /<img[^>]+src="?([^"\s]+)">/g;
  while ((m = rex.exec(str))) {
    urls.push(m[1]);
  }
  for (var i = 0; i < urls.length; i++) {
    var ql_img_arr = urls[i].split("/");
    var delete_img_name = ql_img_arr[ql_img_arr.length - 1];
    await DeleteFromS3(delete_img_name);
  }
});

if (process.env.API_PORT) {
  app.listen(process.env.API_PORT);
  console.log(`server started at port ${process.env.API_PORT}`);
}

module.exports = app;
