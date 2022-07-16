const User = require("../models/User.model");

module.exports.isAuthorized = function (req, res, next) {
  if (req.session.currentUser) {
    return next();
  } else {
    return res.render("auth/index");
  }
};
