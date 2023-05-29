const mongoose = require("mongoose");

// schema for data query
// const Schema = mongoose.Schema;
const { Schema, model } = mongoose;
const projectdataschema = new Schema({
  username: {
    type: String,
    required: true,
  },
  projectname: {
    type: String,
    required: true,
  },
  projectdata: {
    type: String,
  },
});

// model creation for CRUD operation
// note that data will be in the user_authentications collection unless third
// parameter is passed into the model() function
const ProjectData = model("projectdata", projectdataschema, "projectdata");

module.exports = ProjectData;

// NOTE:
// PersonJSONable and TaskJSONable to be converted into strings using JSON.stringify()
// before being added into MongoDB
