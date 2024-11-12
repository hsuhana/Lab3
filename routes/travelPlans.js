// Naming convention > controllers/routers are plural
// Import express and create router object
const express = require("express");
const router = express.Router();
// Import mongoose model to be used
const TravelPlan = require("../models/travelPlan");
const Country = require("../models/country");
// Moved middleware function to extensions/authentication.js to make it reusable across different routers
const AuthenticationMiddleware = require("../extensions/authentication");
// Custom Middleware function to check for an authenticated user
// function AuthenticationMiddleware(req, res, next) {
//     if (req.isAuthenticated()) { // returns true if the session was started
//         return next(); // calls the next middleware in the stack
//     }
//     else {
//         // user not authenticated
//         res.redirect("/login");
//     }
// }
// Configure GET/POST handlers
// Path relative to the one configured in app.js > /projects
// GET /travelPlans/
router.get("/", AuthenticationMiddleware, async (req, res, next) => {
  // retrieve ALL data, and sort by dueDate
  let travelPlans = await TravelPlan.find().sort([["date", "descending"]]).populate("country");
  // render view
  res.render("travelPlans/index", { title: "Travel Plan Tracker", dataset: travelPlans, user: req.user });
});

// GET /travelPlans/add
router.get("/add", AuthenticationMiddleware, async (req, res, next) => {
  let countryList = await Country.find().sort([["countryName", "ascending"]]);
  res.render("travelPlans/add", { title: "Add a New Travel Plan", countries: countryList, user: req.user });
});

// POST /travelPlans/add
router.post("/add", AuthenticationMiddleware, async (req, res, next) => {
  // use the project module to save data to DB
  // use the new Project() method of the model
  // and map the fields with data from the request
  // newProject object is returned if operation was successful
  // save changes and redirect
  let newTravelPlan = new Project({
    budget: req.body.budget,
    date: req.body.date,
    country: req.body.country,
    status: req.body.status,
  });
  await newTravelPlan.save();
  res.redirect("/travelPlans");
});

// GET /travelPlans/delete/:_id
// access parameters via req.params object
router.get("/delete/:_id", AuthenticationMiddleware, async (req, res, next) => {
  let travelPlanId = req.params._id;
  await TravelPlan.findByIdAndRemove({ _id: travelPlanId });
  res.redirect("/travelPlans");
});

// GET /travelPlans/edit/:_id
router.get("/edit/:_id", AuthenticationMiddleware, async (req, res, next) => {
  let travelPlanId = req.params._id;
  let travelPlanData = await TravelPlan.findById(travelPlanId);
  let countryList = await Country.find().sort([["countryName", "ascending"]]);
  res.render("travelPlans/edit", {
    title: "Edit Travel Plan Info",
    travelPlan: travelPlanData,
    countries: countryList,
    user: req.user,
  });
});

// POST /travelPlans/edit/:_id
router.post("/edit/:_id", AuthenticationMiddleware, async (req, res, next) => {
  let travelPlanId = req.params._id;
  await TravelPlan.findByIdAndUpdate(
    { _id: travelPlanId },
    {
      budget: req.body.budget,
      date: req.body.date,
      country: req.body.country,
      status: req.body.status,
    }
  );
  res.redirect("/travelPlans");
});

// Export router object
module.exports = router;
