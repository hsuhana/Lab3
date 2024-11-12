var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
// Router Objects
var indexRouter = require("./routes/index");
var travelPlansRouter = require("./routes/travelPlans");
var countriesRouter = require("./routes/countries");
// var usersRouter = require('./routes/users');
// Import MongoDB and Configuration modules
var mongoose = require("mongoose");
var configs = require("./configs/globals");
// HBS Helper Methods
var hbs = require("hbs");
// Import passport and session modules
var passport = require('passport');
var session = require('express-session');
// Import user model
var User = require('./models/user');
// Import GitHub Strategy
var githubStrategy = require("passport-github2").Strategy;
//Import Google Strategy
var googleStrategy = require("passport-google-oauth20").Strategy;

// Express App Object
var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
// Express Configuration
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
// Configure passport module https://www.npmjs.com/package/express-session
app.use(session({
  secret: 's2021pr0j3ctTracker',
  resave: false,
  saveUninitialized: false
}));
// Initialize passport
app.use(passport.initialize());
app.use(passport.session());
// Link passport to the user model
passport.use(User.createStrategy());
// configure github strategy
passport.use(new githubStrategy(
  // options object
  {
    clientID: configs.Authentication.GitHub.ClientId,
    clientSecret: configs.Authentication.GitHub.ClientSecret,
    callbackURL: configs.Authentication.GitHub.CallbackURL
  },
  // callback function
  // profile is github profile
  async (accessToken, refreshToken, profile, done) => {
    // search user by ID
    const user = await User.findOne({ oauthId: profile.id });
    // user exists (returning user)
    if (user) {
      // no need to do anything else
      return done(null, user);
    }
    else {
      // new user so register them in the db
      const newUser = new User({
        username: profile.username,
        oauthId: profile.id,
        oauthProvider: 'Github',
        created: Date.now()
      });
      // add to DB
      const savedUser = await newUser.save();
      // return
      return done(null, savedUser);
    }
  }
));
// configure github strategy
passport.use(
  new googleStrategy(
    {
      clientID: configs.Authentication.Google.ClientId,
      clientSecret: configs.Authentication.Google.ClientSecret,
      callbackURL: configs.Authentication.Google.CallbackURL,
    },
    async (accessToken, refreshToken, profile, done) => {
      const user = await User.findOne({ oauthId: profile.id });
      if (user) {
        return done(null, user);
      } else {
        const newUser = new User({
          username: profile.displayName,
          oauthId: profile.id,
          oauthProvider: "Google",
          created: Date.now(),
        });
        const savedUser = await newUser.save();
        return done(null, savedUser);
      }
    }
  )
);
// Set passport to write/read user data to/from session object
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// Routing Configuration
app.use("/", indexRouter);
app.use('/travelPlans', travelPlansRouter);
app.use('/countries', countriesRouter);
// app.use('/users', usersRouter);
// Connecting to the DB
mongoose
  .connect(configs.ConnectionStrings.MongoDB)
  .then((message) => console.log("Connected Successfully!"))
  .catch((error) => console.log(`Error while connecting: ${error}`));
// Sub-Expressions https://handlebarsjs.com/guide/builtin-helpers.html#sub-expressions
// function name and helper function with parameters
hbs.registerHelper("createOptionElement", (currentValue, selectedValue) => {
  var selectedProperty = currentValue == selectedValue.toString() ? "selected" : "";
  return new hbs.SafeString(`<option ${selectedProperty}>${currentValue}</option>`);
});
// helper function to format date values
hbs.registerHelper('toShortDate', (longDateValue) => {
  return new hbs.SafeString(longDateValue.toLocaleDateString('en-CA'));
});
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
