require("dotenv").config();
const db = require("../util/database");
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
    const taskid_arr = await PersonTask.findAll({
      where: { user_id: user_id },
    });

    // taskid_arr is an array of all task objects in people_tasks_table
    console.log(taskid_arr[0].task_id);

    return res.status(201).json({ success: "success" });
    // query people task table to see relevant task id
    // query project task table to see relevant project name
  } catch (err) {
    return res.status(401).json({ error: err });
  }
};

module.exports = { getMyTasksUser };
