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

const getProjsUser = async (req, res, next) => {
  const { user_id } = req.body;
  if (!user_id) {
    return res.status(403).json({
      error: "user_id is required for getting your projects!",
    });
  }
  try {
    // add getprojects logic
  } catch (err) {
    return res.status(401).json({ error: err });
  }
};

const PUTProjectUser = async (req, res, next) => {
  const { user_id, proj_name } = req.body;
  if (!user_id || !proj_name) {
    return res.status(403).json({
      error: "username and project name are required for creating new project",
    });
  }
  try {
    // add create project logic
    const newProj = await Project.create({
      project_name: proj_name,
    }).then((result) => {
      PersonProject.create({
        project_name: proj_name,
        user_id: user_id,
        permission: "owner",
        project_id: result.project_id,
        // availability_start: "2023-06-12 08:05:45.000000",
        // availability_end: "2023-06-12 08:05:45.000000",
      })
        .then(() => {
          console.log("project created successfully");
          return res
            .status(201)
            .json({ success: "project created!", proj_id: result.project_id });
        })
        .catch((err) => {
          console.log(err);
          return res.status(401).json({ error: "project creation failed" });
        });
    });
  } catch (err) {
    return res.status(401).json({ error: err });
  }
};

const PATCHProjectUser = async (req, res, next) => {
  const { proj_id, proj_name } = req.body;
  if (!proj_id || !proj_name) {
    return res.status(403).json({
      error: "username and project name are required for editing project name",
    });
  }
  try {
    // add edit project name logic
    let project = await Project.findOne({ where: { project_id: proj_id } });
    if (!project) {
      throw new Error("Project not found");
    }
    Project.update(
      { project_name: proj_name },
      { where: { project_id: proj_id } }
    ).then(() => {
      return res.status(201).json({
        success: `project name changed successfully to ${proj_name}!`,
      });
    });
  } catch (err) {
    return res.status(401).json({ error: err });
  }
};

const POSTProjectUser = async (req, res, next) => {
  const { user_id, proj_name } = req.body;
  if (!user_id || !proj_name) {
    return res.status(403).json({
      error:
        "username and project name are required for getting project details",
    });
  }
  try {
    // add getting project details logic
  } catch (err) {
    return res.status(401).json({ error: err });
  }
};

const DELETEProjectUser = async (req, res, next) => {
  const { user_id, proj_name } = req.body;
  if (!user_id || !proj_name) {
    return res.status(403).json({
      error: "username and project name are required for deleting project",
    });
  }
  try {
    // add delete project logic
  } catch (err) {
    return res.status(401).json({ error: err });
  }
};

module.exports = {
  getProjsUser,
  PUTProjectUser,
  PATCHProjectUser,
  POSTProjectUser,
  DELETEProjectUser,
};
