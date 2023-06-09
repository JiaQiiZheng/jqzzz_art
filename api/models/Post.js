const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const PostSchema = new Schema(
  {
    projectName: String,
    title: String,
    summary: String,
    content: String,
    cover: String,
    author: { type: Schema.Types.ObjectId, ref: "User" },
    section: String,
    uploadedFiles: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

const PostModel = model("Post", PostSchema);

module.exports = PostModel;
