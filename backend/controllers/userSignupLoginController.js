require("dotenv").config();
const db = require("../util/database");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const Person = require("./../models/Person");
// const Projects = require("../models/Projects");

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

const signupUser = (req, res, next) => {
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
    db.execute(
      "INSERT INTO people_table (user_name, password_hash) VALUES (?, ?)",
      [username, encryptedPassword]
    ).then(() => console.log("signup success"));
    return res.status(201).json({ success: "success" });
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
    // await 'unwraps' promises
    const tmp = await db.execute(
      "SELECT * FROM people_table WHERE user_name = ?",
      [username]
    );
    console.log(tmp[0]);
    const { user_id, user_name, password_hash } = tmp[0][0];
    // console.log("credentials: " + storedUsername + " " + storedPassword);

    // username not found
    if (!user_name) {
      console.log("login failed: Username not found. Please try again.");
      return res.status(404).json({ error: "username not found" });
    }

    // wrong password
    if (password_hash !== encryptedPassword) {
      console.log("login failed: Password incorrect. Please try again.");
      return res.status(401).json({ error: "password incorrect" });
    }

    // if correct:
    console.log("success!");
    const token = createToken(tmp[0][0].user_id.toString()); // to be added to db
    // add token to db
    await db.execute(
      "UPDATE people_table SET jwt_token = ? WHERE user_name = ?",
      [token, username]
    );
    return res
      .status(201)
      .json({ success: "login success!", token: token, user_id: user_id });
  } catch (err) {
    return res.status(401).json({ error: err });
  }
};

const validateUser = async (req, res, next) => {
  // const token =
  //   req.body.token || req.query.token || req.headers["x-access-token"];
  const { user_id, token } = req.body;
  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const check = await db.execute(
      "SELECT jwt_token FROM people_table WHERE user_id = ?",
      [user_id]
    );
    // console.log(check[0]);
    const { jwt_token } = check[0][0];
    if (!jwt_token) {
      res.status(404).json({ error: "timeout error" });
    } else {
      const decoded = jwt.verify(token, process.env.SECRET);
      req.user = decoded;
      res.status(201).json({ success: "token authenticated!" });
    }
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
};
module.exports = { signupUser, loginUser, validateUser };
// module.exports = { signupUser, loginUser, validateUser, logoutUser };
