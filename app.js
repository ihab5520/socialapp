const express = require("express");
const hbs = require("hbs");
hbs.registerHelper("dateFormat", require("handlebars-dateformat"));
hbs.registerHelper("ifEquals", function (arg1, arg2, options) {
  return arg1 == arg2 ? options.fn(this) : options.inverse(this);
});
const app = express();

require("dotenv/config");
console.log(process.env);
require("./config")(app);
require("./config/session.config")(app);

// ℹ️ Connects to the database
require("./db");
// const mongoose = require('mongoose');
// mongoose.connect("mongodb+srv://Ihab:Eslam552005@cluster0.xnwlp51.mongodb.net/?retryWrites=true&w=majority")
//   .then( result => {
//     app.listen(3000);
//   })
//   .catch( err => {
//     console.log(err);
//   });

//https://social-app-ihab.herokuapp.com/ | https://git.heroku.com/social-app-ihab.git

const cookieParser = require("cookie-parser");
app.use(cookieParser());
const sessions = require("express-session");

//require("./error-handling")(app);

app.use("/", require("./routes/index"));
app.use("/", require("./routes/auth.routes"));
app.use("/", require("./routes/post.routes"));
app.use("/", require("./routes/friend.routes"));
const privateRoutes = require("./routes/private.routes");
app.use("/", privateRoutes);

const projectName = "social app";

app.locals.appTitle = `${projectName} created with IronLauncher`;

app.listen(3000, (error) => {
  console.log("server is running");
});
