const { Schema, model } = require("mongoose");

const friendSchema = new Schema(
  {
    fromUser: { type: Schema.Types.ObjectId, ref: "User" },
    toUser: { type: Schema.Types.ObjectId, ref: "User" }
  },
  {
    timestamps: true,
  }
);

const Friend = model("Friend", friendSchema);

module.exports = Friend;
