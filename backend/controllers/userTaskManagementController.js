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

const PUTTaskUser = async (req, res, next) => {
  const { project_id, group_id } = req.body;
  if (!project_id || !group_id) {
    return res.status(403).json({
      error: "group ID and project ID are required for adding task to project",
    });
  }
  try {
    // add add task logic
  } catch (err) {
    return res.status(401).json({ error: err });
  }
};

const DELETETaskUser = async (req, res, next) => {
  const { task_id } = req.body;
  if (!task_id) {
    return res.status(403).json({
      error: "task ID is required for deleting task from project",
    });
  }
  try {
    // add add task logic
  } catch (err) {
    return res.status(401).json({ error: err });
  }
};

const PATCHTaskUser = async (req, res, next) => {
  const { taskJSON } = req.body;
  if (!taskJSON) {
    return res.status(403).json({
      error: "task JSON is required for editing task in project",
    });
  }
  try {
    // add edit task logic
  } catch (err) {
    return res.status(401).json({ error: err });
  }
};

const PUTTaskGroupUser = async (req, res, next) => {
  const { project_id, pax, task_group_name, task_arr_JSON } = req.body;
  if (!project_id || !pax || !task_arr_JSON || !task_group_name) {
    return res.status(403).json({
      error:
        "task array JSON, task group name, project ID and pax are required for editing task in project",
    });
  }
  try {
    // add add task group logic
    // add record into taskgroup table
    let id_array = [];
    let group_id = 0;
    await TaskGroup.create({
      task_name: task_group_name,
      pax: task_arr_JSON.length,
    })
      .then(async (taskgrp) => {
        group_id = taskgrp.group_id;
        for (let i = 0; i < task_arr_JSON.length; i++) {
          await Task.create({
            task_JSON: task_arr_JSON[i],
            completed: false,
            preassigned: false,
          }).then((task) => {
            id_array[i] = task.task_id;
            TaskGroupTask.create({
              group_id: taskgrp.group_id,
              task_id: task.task_id,
            });
          });
        }
      })
      .then(() => {
        return res.status(201).json({
          success: "task group and respective tasks added successfully",
          group_id: group_id,
          id_array: id_array,
        });
      })
      .catch((err) => {
        return res.status(401).json({
          error: err,
        });
      });
    // add record into tasks table
    // add record into taskgrouptask table
  } catch (err) {
    return res.status(401).json({ error: err });
  }
};

const DELETETaskGroupUser = async (req, res, next) => {
  const { group_id } = req.body;
  if (!group_id) {
    return res.status(403).json({
      error: "Group ID is required for editing task in project",
    });
  }
  try {
    // add remove task group logic
  } catch (err) {
    return res.status(401).json({ error: err });
  }
};

const PATCHTaskGroupUser = async (req, res, next) => {
  const { group_id, pax, task_arr_JSON } = req.body;
  if (!group_id || !pax || !task_arr_JSON) {
    return res.status(403).json({
      error:
        "task array JSON, group ID and pax are required for editing task in project",
    });
  }
  try {
    // add update task group logic
    // add new task group info
    let taskgrp = await TaskGroup.findOne({
      where: { group_id: group_id },
    }).then(async (taskgrp) => {
      const task_group_name = taskgrp.task_name;
      let id_array = [];
      await TaskGroup.update(
        {
          task_name: task_group_name,
          pax: taskgrp.pax + task_arr_JSON.length,
        },
        {
          where: { group_id: group_id },
        }
      )
        .then(async (taskgrp) => {
          console.log("task group updated! adding tasks...");
          for (let i = 0; i < task_arr_JSON.length; i++) {
            await Task.create({
              task_JSON: task_arr_JSON[i],
              completed: false,
              preassigned: false,
            }).then((task) => {
              id_array[i] = task.task_id;
              TaskGroupTask.create({
                group_id: group_id,
                task_id: task.task_id,
              });
            });
          }
        })
        .then(() => {
          return res.status(201).json({
            success: "task group and respective tasks added successfully",
            group_id: group_id,
            id_array: id_array,
          });
        })
        .catch((err) => {
          return res.status(401).json({
            error: err,
          });
        });
    });
  } catch (err) {
    return res.status(401).json({ error: err });
  }
};

module.exports = {
  PUTTaskUser,
  DELETETaskUser,
  PATCHTaskUser,
  PUTTaskGroupUser,
  DELETETaskGroupUser,
  PATCHTaskGroupUser,
};
