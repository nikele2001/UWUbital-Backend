require("dotenv").config();
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const createToken = (_id) => {
  return jwt.sign({ _id }, "process.env.SECRET", {
    expiresIn: "1d",
  });
};

console.log(createToken("123"));
