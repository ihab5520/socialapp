const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: [true, "Username is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address."], // This is being checked by mongoose!
      lowercase: true,
      trim: true,
    },
    password: String,
    location: String,
    imageUrl: {
      type: String,
    },
    status: String,
  },
  {
    timestamps: true, //2 createdAt , updatedAt
  }
);

const User = model("User", userSchema);

module.exports = User;
