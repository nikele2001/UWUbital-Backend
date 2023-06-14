require("dotenv").config();
const sequelize = require("../util/database");

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
  // check if project exist
  const proj = await Project.findOne({ where: { project_id: project_id } });
  if (proj === null) {
    return res.status(404).json({ error: "project not found" });
  }

  let id_array = [];
  let group_id = 0;
  await TaskGroup.create({
    task_group_name: task_group_name,
    pax: pax,
  })
    // create record in project task group table
    .then((result) => {
      group_id = result.group_id;
      return ProjectTaskGroup.create({
        group_id: result.group_id,
        project_id: project_id,
      });
    })
    .then((taskgroup) => {
      group_id = taskgroup.group_id;
      console.log(`group_id: ${group_id}`);
    })
    .catch((err) => res.status(401).json({ error: err }));

  taskJSON_promise_arr = task_arr_JSON.map(
    (x) => new Promise((resolve, reject) => resolve(x))
  );

  Promise.all(taskJSON_promise_arr)
    // create record in task table
    .then(async (result) => {
      console.log("adding tasks to tasks table...");
      for (let i = 0; i < result.length; i++) {
        // console.log(result[i]);
        result[i] = await Task.create({
          task_JSON: result[i],
        });
      }
      return result;
    })
    // create record in project task table
    .then(async (result) => {
      console.log("adding records in project task table...");
      for (let i = 0; i < result.length; i++) {
        result[i] = await ProjectTask.create({
          project_id: project_id,
          task_id: result[i].task_id,
        });
      }
      return result;
    })
    // create record in task group task table
    .then(async (result) => {
      console.log("adding records into task group task table...");
      for (let i = 0; i < result.length; i++) {
        result[i] = await TaskGroupTask.create({
          group_id: group_id,
          task_id: result[i].task_id,
        });
      }
      return result;
    })
    // add task id to idarray
    .then((result) => {
      console.log("pushing task ids into id array...");
      for (let i = 0; i < result.length; i++) {
        // console.log(result[i].task_id);
        id_array.push(result[i].task_id);
      }
    })
    .then(() => {
      console.log("task group added successfully");
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
  // find entries in task group task table, obtain taskids related
  // delete entries in task table
  // delete entries in task group table, project task table and people task table automatically (cascading)
  // run PUTTaskGroupUser
  // add new task group info
  // get project id and task group name
  const findCond = { where: { group_id: group_id } };

  // finding project id so that project task table can be updated accordingly
  const proj = await ProjectTaskGroup.findAll({
    where: { group_id: group_id },
  });
  const project_id = proj[0].project_id;
  console.log("number: " + project_id);
  console.log("finding...");

  // removing old records from task table
  await TaskGroupTask.findAll({
    attributes: [
      [sequelize.fn("DISTINCT", sequelize.col("task_id")), "task_id"],
    ],
    where: { group_id: group_id },
  }).then(async (result) => {
    for (let i = 0; i < result.length; i++) {
      await Task.destroy({ where: { task_id: result[i].task_id } });
    }
    return result;
  });

  taskJSON_promise_arr = task_arr_JSON.map(
    (x) => new Promise((resolve, reject) => resolve(x))
  );
  console.log("Removed existing tasks under task group. adding new tasks...");

  // adding updated tasks to task group and relevant relation tables
  Promise.all(taskJSON_promise_arr)
    // create record in task table
    .then(async (result) => {
      console.log("adding tasks to tasks table...");
      for (let i = 0; i < result.length; i++) {
        // console.log(result[i]);
        result[i] = await Task.create({
          task_JSON: result[i],
        });
      }
      return result;
    })
    // create record in project task table
    .then(async (result) => {
      console.log("adding records in project task table...");
      for (let i = 0; i < result.length; i++) {
        result[i] = await ProjectTask.create({
          project_id: project_id,
          task_id: result[i].task_id,
        });
      }
      return result;
    })
    // create record in task group task table
    .then(async (result) => {
      console.log("adding records into task group task table...");
      for (let i = 0; i < result.length; i++) {
        result[i] = await TaskGroupTask.create({
          group_id: group_id,
          task_id: result[i].task_id,
        });
      }
      return result;
    })
    .then(() => {
      console.log("task group added successfully");
      return res.status(201).json({
        success: "task group and respective tasks added successfully",
      });
    })
    .catch((err) => {
      return res.status(401).json({
        error: err,
      });
    });
};

module.exports = {
  PUTTaskUser,
  DELETETaskUser,
  PATCHTaskUser,
  PUTTaskGroupUser,
  DELETETaskGroupUser,
  PATCHTaskGroupUser,
};
