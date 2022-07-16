const { Router } = require("express");
const router = new Router();
const User = require("../models/User.model");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { isLoggedIn, isLoggedOut } = require("../middleware/route-guard.js");
const fileUploader = require("../config/cloudinary.config");
const saltRounds = 10;

var session;

//==========================//
//          HOME            //
//==========================//

router.get("/", (req, res) => {
  session = req.session;
  if (session.currentUser) res.redirect("/home");
  else res.render("auth/index");
});

//==========================//
//         PROFILE          //
//==========================//

router.get("/profile", (req, res) => {
  session = req.session;
  if (session.currentUser)
    res.render("home/profile", { user: session.currentUser });
  else res.render("auth/index");
});

router.post(
  "/update-profile",
  fileUploader.single("imageUrl"),
  async (req, res) => {
    const { status, location, imageUrl } = req.body;
    // let newImage;
    // if (req.file) {
    //   newImage = req.file.path;
    // } else {
    //   newImage = imageUrl;
    // }
    const userId = req.session.currentUser._id;
    await User.findByIdAndUpdate(userId, {
      location: location,
      status: status,
      imageUrl: req.file.path,
    });
    const user = req.session.currentUser;
    user.location = location;
    user.status = status;
    user.imageUrl = req.file.path;
    res.status(201).redirect("/profile");
  }
);

//==========================//
//          LOGIN           //
//==========================//

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  // If the from is empty
  if (!username || !password) {
    res.render("auth/index", {
      errorMessage: "Please fill all the fields",
    });
    return;
  }

  User.findOne({ username: username }).then((userFromDb) => {
    // If the person does not exists. Send an error.
    if (!userFromDb) {
      res.render("auth/index", {
        errorMessage:
          "There is no user with this username. Please create an account or verify you credentials",
      });
      return;
    }

    // This function tells us if the password that we recieve from the FORM matches the password that we stored in the DB
    if (!bcrypt.compareSync(password, userFromDb.password)) {
      res.render("auth/index", {
        errorMessage: "Invalid Credentials",
      });
      return;
    }

    session = req.session;
    req.session.currentUser = userFromDb;
    res.redirect("/home");
  });
});

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    res.redirect("/");
  });
});

//==========================//
//          SIGNUP          //
//==========================//

router.post("/signup", async (req, res, next) => {
  //console.log("The form data: ", req.body);

  const { username, email, password, location } = req.body;

  // make sure users fill all mandatory fields:
  if (!username || !email || !password) {
    res.render("auth/index", {
      errorMessage:
        "All fields are mandatory. Please provide your username, email and password.",
    });
    return;
  }

  // make sure passwords are strong:
  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)) {
    res.status(500).render("auth/index", {
      errorMessage:
        "Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.",
    });
    return;
  }

  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    const user = await User.create({
      username: username,
      email: email,
      password: hash,
      location: location,
    });
    res.status(201).redirect("/home");
  } catch (error) {
    //console.log(error);
    //Checks if the Mongoose validation passes. If not, send the mongoose error to the view
    if (error instanceof mongoose.Error.ValidationError) {
      // Is my error comming from mongoose.
      res.render("auth/index", {
        errorMessage: error.message,
      });
    }
    // If this error comes from mongo and the code is 11000 => Wich means unique validation failed
    else if (error.code === 11000) {
      res.render("auth/index", {
        errorMessage: " Username and email already exist",
      });
    }
  }
});

module.exports = router;
