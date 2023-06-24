require("dotenv").config();
const db = require("../util/database");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

// const Person = require("../algorithm/Person");
// const Projects = require("../models/Projects");
const Person = require("../models/people");

const createToken = (_id) => {
  return jwt.sign({ _id }, "purpledoggonotpinkcatnotbrownfox", {
    expiresIn: "1d",
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
  const { personName, password } = req.body;
  if (!personName || !password) {
    return res
      .status(403)
      .json({ error: "Both username and password is required for signing up" });
  }
  let cipher = crypto.createCipheriv(algorithm, Securitykey, initVector);
  let encryptedPassword =
    cipher.update(password, "utf-8", "hex") + cipher.final("hex");
  try {
    const existingUser = await Person.findOne({
      where: { user_name: personName },
    });
    if (existingUser === null) {
      const user = await Person.create({
        user_name: personName,
        password_hash: encryptedPassword,
      });
      return res.status(201).json({ success: "success" });
    } else {
      return res.status(403).json({ error: "username taken" });
    }
  } catch (err) {
    return res.status(401).json({ error: err });
  }
};

const loginUser = async (req, res, next) => {
  const { personName, password } = req.body;
  if (!personName || !password) {
    return res
      .status(403)
      .json({ error: "Both username and password is required for logging in" });
  }
  let cipher = crypto.createCipheriv(algorithm, Securitykey, initVector);
  let encryptedPassword =
    cipher.update(password, "utf-8", "hex") + cipher.final("hex");
  try {
    // await 'unwraps' promises
    const existingUser = await Person.findOne({
      where: { user_name: personName },
    });
    // username not found
    if (existingUser === null) {
      console.log("login failed: Username not found. Please try again.");
      return res.status(404).json({ error: "username not found" });
    }

    // wrong password
    if (existingUser.password_hash !== encryptedPassword) {
      console.log("login failed: Password incorrect. Please try again.");
      return res.status(403).json({ error: "password incorrect" });
    }

    // if correct:
    console.log("success!");
    const token = createToken(existingUser.user_id.toString()); // to be added to db
    // add token to db
    await Person.update(
      {
        jwt_token: token,
      },
      {
        where: {
          user_name: personName,
        },
      }
    )
      .then((updatedRows) => {
        console.log(`Updated ${updatedRows} row(s).`);
      })
      .catch((err) => console.log("error updating token"));
    return res.status(201).json({
      success: "login success!",
      token: token,
      personId: existingUser.user_id,
    });
  } catch (err) {
    return res.status(401).json({ error: err });
  }
};

const validateUser = async (req, res, next) => {
  // const token =
  //   req.body.token || req.query.token || req.headers["x-access-token"];
  const { personId, token } = req.body;
  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const existingUser = await Person.findOne({
      where: { user_id: personId },
    });
    // console.log(check[0]);
    const jwt_token = existingUser.jwt_token;
    if (!jwt_token) {
      res.status(404).json({ error: "Timeout error" });
    } else {
      const decoded = jwt.verify(token, "purpledoggonotpinkcatnotbrownfox");
      req.user = decoded;
      res.status(201).json({ success: "Token authenticated!" });
    }
  } catch (err) {
    return res.status(401).send("Invalid Token. Please log in again.");
  }
};
module.exports = { signupUser, loginUser, validateUser };
// module.exports = { signupUser, loginUser, validateUser, logoutUser };
