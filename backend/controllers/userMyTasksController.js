require("dotenv").config();
const db = require("../util/database");
const sequelize = require("../util/database");
// const task = require("./../models/Task");
// const taskJSONable = require("./../models/taskJSONable");

// import statements for models and object TODO
// import models
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

const getMyTasksUser = async (req, res, next) => {
  const { user_id } = req.body;
  if (!user_id) {
    return res.status(403).json({
      error: "user_id is required for getting your tasks!",
    });
  }
  try {
    // query people project for project name
    // query people task group for task groups
    // query people task for tasks
    // console.log("bleh");
    let namearr = [];
    const user = await Person.findOne({ where: { user_id: user_id } });
    if (!user) {
      return res.status(404).json({ error: "user_id not found" });
    }
    // console.log("user found");
    // projidarr is an array of JSON objects with distinct project_id values showing project_id of projects user is in
    const projidarr = PersonProject.findAll({
      attributes: [
        [sequelize.fn("DISTINCT", sequelize.col("project_id")), "project_id"],
      ],
      where: { user_id: user_id },
    }).then((projidarr) => {
      const idarr = projidarr.map((x) => x.project_id);
      nameoutarr = idarr.map(async (id) => {
        await Project.findOne({ where: { project_id: id } }).then((result) => {
          console.log("fk");
          nameoutarr.push(result.project_name);
          console.log(result.project_name);
        });
      });
      Promise.all(nameoutarr).then(() => {
        console.log(nameoutarr);
        return res.status(201).json({
          success: "success",
          projects: nameoutarr,
        });
      });
    });

    // query people task table to see relevant task id
    // query project task table to see relevant project name
  } catch (err) {
    return res.status(401).json({ error: err });
  }
};

module.exports = { getMyTasksUser };
