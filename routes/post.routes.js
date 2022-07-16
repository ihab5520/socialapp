const { Router } = require("express");
const router = new Router();
const User = require("../models/User.model");
const Post = require("../models/Post.model");
const Friend = require("../models/Friend.model");
const auth = require("../Utils/auth");
const mongoose = require("mongoose");

//==========================//
//        CREATE POST       //
//==========================//

router.post("/create-post", async (req, res) => {
  const { content } = req.body;
  // If the from is empty
  if (!content) {
    res.render("/home", {
      errorMessage: "Please fill all the fields",
    });
    return;
  }

  const post = await Post.create({
    description: content,
    owner: req.session.currentUser,
  });
  console.log(post);
  res.status(201).redirect("/home");
});

//==========================//
//        LIST POSTS        //
//==========================//

router.get("/home", auth.isAuthorized, async (req, res, next) => {
  const posts = await Post.find()
    .populate("owner")
    .sort({ createdAt: -1 })
    .exec();
  const users = await User.find({
    username: { $ne: req.session.currentUser.username },
  })
    .sort({ createdAt: -1 })
    .exec();

  const friends = await Friend.find({
    $or: [
      { fromUser: req.session.currentUser },
      { toUser: req.session.currentUser },
    ],
  })
    .sort({ createdAt: -1 })
    .populate("fromUser")
    .exec();
  res.render("home/home", {
    user: req.session.currentUser,
    users: users,
    posts: posts,
    friends: friends,
  });
});

//==========================//
//        DELETE POST       //
//==========================//

router.get("/delete-post/:postId", async (req, res) => {
  Post.findByIdAndDelete(req.params.postId)
    .then(() => res.status(201).redirect("/home"))
    .catch((error) => console.log(error));
});

module.exports = router;
