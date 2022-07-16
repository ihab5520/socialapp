const { Router } = require("express");
const router = new Router();
const User = require("../models/User.model");
const auth = require("../Utils/auth");
const mongoose = require("mongoose");
const Friend = require("../models/Friend.model");

//==========================//
//      ADD FRIEND          //
//==========================//
router.get("/add-friend/:userId", async (req, res) => {
  const user = await User.findOne({ _id: req.params.userId });

  const added = await Friend.create({
    fromUser: user,
    toUser: req.session.currentUser,
  });
  console.log(added);
  res.status(201).redirect("/home");
});

//==========================//
//         UNFRIEND         //
//==========================//
router.get("/unfriend/:id", async (req, res) => {
  Friend.findByIdAndDelete(req.params.id)
    .then(() => res.status(201).redirect("/home"))
    .catch((error) => console.log(error));
});

//==========================//
//        DELETE POST       //
//==========================//

module.exports = router;
