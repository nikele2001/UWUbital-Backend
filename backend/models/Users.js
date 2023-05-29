const mongoose = require("mongoose");

// schema for data query
// const Schema = mongoose.Schema;
const { Schema, model } = mongoose;
const userschema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  token: {
    type: String,
  },
});

// model creation for CRUD operation
// note that data will be in the user_authentications collection unless third
// parameter is passed into the model() function
const Users = model("user_authentication", userschema, "user_authentication");

module.exports = Users;
