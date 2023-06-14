require("dotenv").config();
const sequelize = require("../util/database");
// import statements for models and object TODO
const { TaskGroupJSONable } = require("./../algorithm/TaskGroupJSONable");
const { TaskJSONable } = require("./../algorithm/TaskJSONable");
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

// not done yet
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
};

const PATCHProjectUser = async (req, res, next) => {
  const { proj_id, proj_name } = req.body;
  if (!proj_id || !proj_name) {
    return res.status(403).json({
      error: "username and project name are required for editing project name",
    });
  }
  // add edit project name logic
  let project = await Project.findOne({ where: { project_id: proj_id } });
  if (!project) {
    return res.status(404).json({ error: "Project not found" });
  }
  Project.update(
    { project_name: proj_name },
    { where: { project_id: proj_id } }
  ).then(() => {
    return res.status(201).json({
      success: `project name changed successfully to ${proj_name}!`,
    });
  });
};

const POSTProjectUser = async (req, res, next) => {
  const { user_id, proj_id } = req.body;
  if (!user_id || !proj_id) {
    return res.status(403).json({
      error: "user id and project id are required for getting project details",
    });
  }
  // check if project exists
  const proj = await Project.findOne({ where: { project_id: proj_id } });
  if (proj === null) {
    return res.status(404).json({ error: "project not found" });
  }
  // check if user has viewing rights (PersonProject)
  const user = await PersonProject.findOne({
    where: {
      user_id: user_id,
      project_id: proj_id,
    },
  });

  if (user === null) {
    return res.status(403).json({ error: "user does not have viewing rights" });
  }
  // get task groups that belong to the project (ProjectTaskGroup)
  const task_group_array = await ProjectTaskGroup.findAll({
    attributes: [
      sequelize.fn("DISTINCT", sequelize.col("group_id")),
      "group_id",
    ],
    where: { project_id: proj_id },
  });
  // an array of promises, each promise contain a record with the field group_id
  const task_group_promise_array = task_group_array.map(
    (x) => new Promise((resolve, reject) => resolve(x))
  );

  Promise.all(task_group_promise_array)
    // get task_group_name and pax for each task group
    .then(async (result) => {
      console.log("finding task group information (pax and group name)...");
      for (let i = 0; i < result.length; i++) {
        const tg = await TaskGroup.findOne({
          where: { group_id: result[i].group_id },
        });
        result[i] = {
          group_id: result[i].group_id,
          task_group_name: tg.task_group_name,
          pax: tg.pax,
        };
        console.log("successfully found task group information!");
        console.log(result);
        return result;
      }
    })
    // get task id specific to task group id
    // get task id for each task groups in the project (TaskGroupTask)
    .then(async (result) => {
      console.log("finding tasks in respective task group...");
      for (let i = 0; i < result.length; i++) {
        // an array of records from the task group task table
        const tasks_arr = await TaskGroupTask.findAll({
          where: { group_id: result[i].group_id },
        });
        result[i] = {
          group_id: result[i].group_id,
          task_group_name: result[i].task_group_name,
          pax: result[i].pax,
          // tasks is an array of task ids relevant to the task group
          tasks: tasks_arr.map((x) => x.task_id),
        };
      }
      return result;
    })
    // get task records based on task ids for each task group (Task)
    .then(async (result) => {
      console.log(
        "finding task information for each task in each task group..."
      );
      for (let i = 0; i < result.length; i++) {
        result[i] = {
          group_id: result[i].group_id,
          task_group_name: result[i].task_group_name,
          pax: result[i].pax,
          // tasks is now an array of records from the tasks table
          tasks: result[i].tasks.map(
            async (x) => await Task.findOne({ where: { task_id: x } }) // why does this line execute first before the subsequent then() statement??
          ),
        };
      }
      return result;
    })
    // constructing TaskGroupJSONable
    .then(async (result) => {
      for (let i = 0; i < result.length; i++) {
        // remember to stringify product!!!!
        result[i] = new TaskGroupJSONable(
          result[i].group_id,
          result[i].task_group_name,
          result[i].tasks.map((x) => x.task_JSON),
          result[i].pax
        );
        return result;
      }
    })
    .then((result) => {
      console.log("project retrieval successful");
      console.log(result);
      return res
        .status(201)
        .json({ success: "project info retrieval successful" });
    })
    .catch((err) =>
      res
        .status(401)
        .json({ error: "error finding for tasks in task groups in project" })
    );
  // get all personnel info for the project (PersonProject)
};

const DELETEProjectUser = async (req, res, next) => {
  const { user_id, proj_id } = req.body;
  if (!user_id || !proj_id) {
    return res.status(403).json({
      error: "user id and project id are required for deleting project",
    });
  }

  const user = await PersonProject.findOne({
    where: { user_id: user_id, project_id: proj_id },
  });
  if (!user) {
    return res.status(404).json({ error: "user not found" });
  }
  if (user.permission !== "owner") {
    return res
      .status(403)
      .json({ error: "user is not allowed to delete project; not the owner!" });
  }

  // deleting all task groups in project
  let taskgrppromisearr = await ProjectTaskGroup.findAll({
    where: { project_id: proj_id },
  });
  taskgrppromisearr = taskgrppromisearr.map(
    (x) => new Promise((resolve, reject) => resolve(x))
  );
  Promise.all(taskgrppromisearr)
    .then(async (result) => {
      for (let i = 0; i < result.length; i++) {
        await TaskGroup.destroy({ where: { group_id: result[i].group_id } });
      }
    })
    .catch(() =>
      res
        .status(401)
        .json({ error: "failed to delete task groups within project" })
    );

  let taskpromisearr = await ProjectTask.findAll({
    where: { project_id: proj_id },
  });
  taskpromisearr = taskpromisearr.map(
    (x) => new Promise((resolve, reject) => resolve(x))
  );

  // deleting all tasks in project
  Promise.all(taskpromisearr)
    .then(async (result) => {
      for (let i = 0; i < result.length; i++) {
        await Task.destroy({ where: { task_id: result[i].task_id } });
      }
    })
    .catch(() =>
      res.status(401).json({ error: "failed to delete tasks within project" })
    );

  // deleting the project itself
  await Project.destroy({ where: { project_id: proj_id } })
    .then(() =>
      res.status(201).json({
        success:
          "successfully deleted project and relevant task groups and tasks",
      })
    )
    .catch(() => res.status(401).json({ error: "failed to delete project" }));
};

module.exports = {
  getProjsUser,
  PUTProjectUser,
  PATCHProjectUser,
  POSTProjectUser,
  DELETEProjectUser,
};
