const mongoose = require("mongoose");

// schema for data query
// const Schema = mongoose.Schema;
const { Schema, model } = mongoose;
const projectsschema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  projectlist: {
    type: [String],
  },
});

// model creation for CRUD operation
// note that data will be in the user_authentications collection unless third
// parameter is passed into the model() function
const Projects = model("projects", projectsschema, "projects");

module.exports = Projects;
