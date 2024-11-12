const express = require("express");
const router = express.Router();
const Country = require("../models/country");
const AuthenticationMiddleware = require("../extensions/authentication");

// GET /Countries/
router.get("/", AuthenticationMiddleware, async (req, res, next) => {
  let countries = await Country.find().sort([["countryName", "ascending"]]);
  res.render("countries/index", { title: "Country List", dataset: countries, user: req.user });
});

// GET /Countries/Add
router.get("/add", AuthenticationMiddleware, (req, res, next) => {
  res.render("countries/add", { title: "Add a new Country", user: req.user });
});

// POST /Countries/Add
router.post("/add", AuthenticationMiddleware, async (req, res, next) => {
  let newCountry = new Country({
    countryName: req.body.countryName,
    currency: req.body.currency,
  });
  await newCountry.save();
  res.redirect("/countries");
});

module.exports = router;