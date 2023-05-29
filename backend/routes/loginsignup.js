const path = require("path");

const express = require("express");

const router = express.Router();

const {
  signupUser,
  loginUser,
  validateUser,
  logoutUser,
} = require("./../controllers/userSignupLoginController");

router.post("/signup", signupUser);

router.post("/login", loginUser);

router.post("/validate", validateUser);

router.post("/logout", logoutUser);

module.exports = router;
