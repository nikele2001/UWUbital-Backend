const express = require("express");

const router = express.Router();

const {
  signupUser,
  loginUser,
  validateUser,
} = require("./../controllers/userSignupLoginController");

router.post("/signup", signupUser);

router.post("/login", loginUser);

router.post("/validate", validateUser);

module.exports = router;
