const express = require("express");
const hbs = require("hbs");
hbs.registerHelper("dateFormat", require("handlebars-dateformat"));
hbs.registerHelper("ifEquals", function (arg1, arg2, options) {
  return arg1 == arg2 ? options.fn(this) : options.inverse(this);
});
const app = express();

require("dotenv/config");
require("./config")(app);
require("./config/session.config")(app);

// ℹ️ Connects to the database
require("./db");
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

app.listen(process.env.PORT, (error) => {
  console.log("server is running");
});
