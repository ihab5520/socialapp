const { Router } = require("express");
const router = new Router();

const mongoose = require("mongoose");

const User = require("../models/User.model");

// require auth middleware
const { isLoggedIn, isLoggedOut } = require("../middleware/route-guard.js");

module.exports = router;
