const { Schema, model } = require("mongoose");

const postSchema = new Schema(
  {
    description: { type: String, maxlength: 200 },
    owner: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

const Post = model("Post", postSchema);

module.exports = Post;
