require("dotenv").config();
// import statements for models and object TODO
const Person = require("./../models/people");
const Project = require("./../models/projects");
const TaskGroup = require("./../models/taskgroups");
const Task = require("./../models/tasks");
const {
  PersonProject,
  PersonTaskGroup,
  PersonTask,
  ProjectTaskGroup,
  ProjectTask,
  TaskGroupTask,
} = require("./../models/relations");

const runUser = async (req, res, next) => {
  return res.status(201).json({ success: "fk u algo not up" });
};

module.exports = { runUser };
