require("dotenv").config();
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const Users = require("./../models/Users");
const Projects = require("../models/Projects");

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, {
    expiresIn: process.env.TOKEN_DURATION,
  });
};

// constant declarations for encryption
const algorithm = "aes-256-cbc";
const initVector = Buffer.from("7d3039e7f8a32ff9d12d5802290532df", "hex");
const Securitykey = Buffer.from(
  "ac0aabe13d0856f66b0dde912faac79b8d3839b00ac28c43dd21127642f5a1d4",
  "hex"
);
// side note: Everytime encryption/decryption is run, a new cipher object needs to be created.

const signupUser = async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(403)
      .json({ error: "Both username and password is required for signing up" });
  }
  let cipher = crypto.createCipheriv(algorithm, Securitykey, initVector);
  let encryptedPassword =
    cipher.update(password, "utf-8", "hex") + cipher.final("hex");
  try {
    const check = await Users.findOne({ username: username });
    // add logic to prevent duplicate usernames and invalid password
    if (check) {
      console.log("Username taken. Please try another username.");
      return res.status(403).json({ error: "signup failed: username taken" });
    } else {
      console.log("signup success: Please try logging in!");
      const arr = [];
      await Projects.create({
        username: username,
        projectlist: arr,
        token: "",
      });
      await Users.create({ username: username, password: encryptedPassword });
      res
        .status(201)
        .json({ success: "signup success: Please try logging in!" });
      // res.redirect("/login");
    }
    // console.log(req.body);
  } catch (err) {
    return res.status(401).json({ error: err });
  }
};

const loginUser = async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(403)
      .json({ error: "Both username and password is required for logging in" });
  }
  let cipher = crypto.createCipheriv(algorithm, Securitykey, initVector);
  let encryptedPassword =
    cipher.update(password, "utf-8", "hex") + cipher.final("hex");
  try {
    Users.findOne({ username: username }).then((check) => {
      if (!check) {
        console.log("login failed: Username not found. Please try again.");
        return res.status(404).json({ error: "username not found" });
      } else if (check.password !== encryptedPassword) {
        console.log("login failed: Password incorrect. Please try again.");
        return res.status(401).json({ error: "password incorrect" });
      } else {
        console.log("success!");
        const token = createToken(check._id.toString());
        // send token
        Users.findOneAndUpdate({ username: username }, { token: token }).exec();
        return res
          .status(201)
          .json({ success: "login success!", token: token });
      }
    });
  } catch (err) {
    return res.status(401).json({ error: "???" });
  }
};

const validateUser = async (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];
  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const check = Users.findOne({ username: req.username }).exec();
    if (!check) {
      console.log("login failed: Username not found. Please try again.");
      res.status(404).json({ error: "username not found" });
    } else {
      const decoded = jwt.verify(token, process.env.SECRET);
      req.user = decoded;
      res.status(201).json({ success: "token authenticated!" });
    }
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
};

const logoutUser = async (req, res, next) => {
  const { username } = req.body;
  if (!username) {
    return res
      .status(403)
      .json({ error: "username is required for logging out" });
  }
  try {
    await Users.findOneAndUpdate({ username: username }, { token: "" }).then(
      (x) => {
        res.status(201).json({ success: "logout success" });
      }
    );
  } catch (err) {
    return res.status(401).send("User not found");
  }
};

module.exports = { signupUser, loginUser, validateUser, logoutUser };
