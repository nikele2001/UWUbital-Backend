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

// // not needed for now
// const PUTTaskUser = async (req, res, next) => {
//   const { project_id, group_id } = req.body;
//   if (!project_id || !group_id) {
//     return res.status(403).json({
//       error: "group ID and project ID are required for adding task to project",
//     });
//   }
// };

// // not needed for now
// const DELETETaskUser = async (req, res, next) => {
//   const { task_id } = req.body;
//   if (!task_id) {
//     return res.status(403).json({
//       error: "task ID is required for deleting task from project",
//     });
//   }
// };

// // not needed for now
// const PATCHTaskUser = async (req, res, next) => {
//   const { taskJSON } = req.body;
//   if (!taskJSON) {
//     return res.status(403).json({
//       error: "task JSON is required for editing task in project",
//     });
//   }
// };

const PUTTaskGroupUser = async (req, res, next) => {
  const { projectId, pax, taskGroupName, taskArrJSON } = req.body;
  if (!projectId || !pax || !taskArrJSON || !taskGroupName) {
    return res.status(403).json({
      error:
        "task array JSON, task group name, project ID and pax are required for putting tasks in project",
    });
  }
  // // check if project exist
  // const proj = await Project.findOne({ where: { project_id: projectId } });
  // if (proj === null) {
  //   return res.status(404).json({ error: "project not found" });
  // }

  // let id_array = [];
  // let group_id = 0;
  // await TaskGroup.create({
  //   task_group_name: taskGroupName,
  //   pax: pax,
  // })
  //   // create record in project task group table
  //   .then((result) => {
  //     group_id = result.group_id;
  //     return ProjectTaskGroup.create({
  //       group_id: result.group_id,
  //       project_id: projectId,
  //     });
  //   })
  //   .then((taskgroup) => {
  //     group_id = taskgroup.group_id;
  //     console.log(`group_id: ${group_id}`);
  //   })
  //   .catch((err) => res.status(401).json({ error: err }));

  // taskJSON_promise_arr = taskArrJSON.map(
  //   (x) => new Promise((resolve, reject) => resolve(x))
  // );

  // Promise.all(taskJSON_promise_arr)
  //   // create record in task table
  //   .then(async (result) => {
  //     console.log("adding tasks to tasks table...");
  //     for (let i = 0; i < result.length; i++) {
  //       result[i] = await Task.create({
  //         task_JSON: JSON.stringify(result[i]),
  //       });
  //     }
  //     return result;
  //   })
  //   .then(async (result) => {
  //     // adding task IDs to task_JSON
  //     console.log("adding task IDs to taskJSON...");
  //     for (let i = 0; i < result.length; i++) {
  //       let new_result = JSON.parse(result[i].task_JSON);
  //       new_result.taskId = result[i].task_id;
  //       new_result.taskGroupId = group_id;
  //       if (new_result.personId !== null) {
  //         await PersonTaskGroup.findOrCreate({
  //           where: {
  //             user_id: Number(new_result.personId),
  //             group_id: group_id,
  //           },
  //         });
  //         await PersonTask.findOrCreate({
  //           where: {
  //             user_id: Number(new_result.personId),
  //             task_id: new_result.taskId,
  //           },
  //         });
  //         console.log("updated relations table!");
  //       }
  //       new_result = JSON.stringify(new_result);
  //       await Task.update(
  //         { task_JSON: new_result },
  //         { where: { task_id: result[i].task_id } }
  //       );
  //     }
  //     return result;
  //   })
  //   // create record in project task table
  //   .then(async (result) => {
  //     console.log("adding records in project task table...");
  //     for (let i = 0; i < result.length; i++) {
  //       result[i] = await ProjectTask.create({
  //         project_id: projectId,
  //         task_id: result[i].task_id,
  //       });
  //     }
  //     return result;
  //   })
  //   // create record in task group task table
  //   .then(async (result) => {
  //     console.log("adding records into task group task table...");
  //     for (let i = 0; i < result.length; i++) {
  //       result[i] = await TaskGroupTask.create({
  //         group_id: group_id,
  //         task_id: result[i].task_id,
  //       });
  //     }
  //     return result;
  //   })
  //   // add task id to idarray
  //   .then((result) => {
  //     console.log("pushing task ids into id array...");
  //     for (let i = 0; i < result.length; i++) {
  //       id_array.push(result[i].task_id);
  //     }
  //   })
  //   .then(() => {
  //     console.log("task group added successfully");
  //     return res.status(201).json({
  //       success: "task group and respective tasks added successfully",
  //       taskGroupId: group_id,
  //       idArray: id_array,
  //     });
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //     return res.status(401).json({
  //       error: err,
  //     });
  //   });
  const groupId = await TaskGroup.create({
    task_group_name: taskGroupName,
    pax: pax,
  }).then((result) => result.group_id); // create task group record and project task group record
  const outTaskIdArray = [];
  const taskJSONArray = [];
  // create task records, update task_ids in task_JSON
  // array of promises to add new tasks
  const taskCreationPromiseArr = taskArrJSON.map((x) =>
    Task.create({ task_JSON: JSON.stringify(x) })
      .then((result) => {
        let out = JSON.parse(result.task_JSON);
        out.taskId = result.task_id;
        out.taskGroupId = groupId;
        tmp = JSON.stringify(out);
        Task.update({ task_JSON: tmp }, { where: { task_id: result.task_id } });
        return out;
        // result is now a taskJSON object
      })
      .then((result) => {
        outTaskIdArray.push(result.taskId);
        taskJSONArray.push(result);
      })
  );

  const relationPromisesArr = () => {
    // create project task records
    const projectTaskCreationPromiseArr = outTaskIdArray.map((x) =>
      ProjectTask.create({ task_id: x, project_id: projectId })
    );
    // create project task group record
    const projectTaskGroupCreation = [
      ProjectTaskGroup.create({ project_id: projectId, group_id: groupId }),
    ];
    // create task group task records
    const taskGroupTaskCreationPromiseArr = outTaskIdArray.map((x) =>
      TaskGroupTask.create({ task_id: x, group_id: groupId })
    );
    // create person task records and person task group records if required (personId not null)
    const preAssignedTaskJSON = taskJSONArray.filter(
      (x) => x.personId !== null
    );
    const personTaskCreationPromises = preAssignedTaskJSON.map((x) =>
      PersonTask.create({ user_id: x.personId, task_id: x.taskId })
    );
    const personTaskGroupPromises = preAssignedTaskJSON.map((x) =>
      PersonTaskGroup.findOrCreate({
        where: { user_id: x.personId, group_id: groupId },
      })
    );
    return [
      ...projectTaskCreationPromiseArr,
      ...taskGroupTaskCreationPromiseArr,
      ...personTaskCreationPromises,
      ...personTaskGroupPromises,
      ...projectTaskGroupCreation,
    ];
  };

  Promise.all(taskCreationPromiseArr)
    .then(() => {
      console.log(outTaskIdArray);
      console.log(taskJSONArray);
    })
    .then(() => Promise.all(relationPromisesArr()))
    .then(() =>
      res.status(201).json({
        success: "task group added successfully",
        idArray: outTaskIdArray,
        taskGroupId: groupId,
      })
    );
  // .catch((err) =>
  //   res.status(401).json({ error: "unsuccessful addition of task group" })
  // );
};

const DELETETaskGroupUser = async (req, res, next) => {
  const { taskGroupId, taskIdArr, projectId } = req.body;
  if (!taskGroupId || !taskIdArr || !projectId) {
    return res.status(403).json({
      error:
        "taskGroupId, taskIdArr, projectId is required for editing task in project",
    });
  }
  // delete all tasks in task group
  const deleteTasks = Task.destroy({ where: { task_id: taskIdArr } });
  const deleteTaskGroup = TaskGroup.destroy({
    where: { group_id: taskGroupId },
  });
  Promise.all([deleteTasks, deleteTaskGroup])
    .then(() =>
      res.status(201).json({ success: "task group deletion successful" })
    )
    .catch((err) =>
      res.status(401).json({ error: "task group deletion unsuccessful" })
    );
};

// NOTE: rewrite operation, not add on
const PATCHTaskGroupUser = async (req, res, next) => {
  const { taskGroupId, pax, taskArrJSON, taskGroupName, projectId, taskIdArr } =
    req.body;
  if (
    !taskGroupId ||
    !pax ||
    !taskArrJSON ||
    !taskGroupName ||
    !projectId ||
    !taskIdArr
  ) {
    return res.status(403).json({
      error:
        "taskGroupId, pax, taskArrJSON, taskGroupName, projectId, taskIdArr are required for editing task in project",
    });
  }

  const outTaskIdArray = [];
  const taskJSONArray = []; // array that contains all taskJSONs to be newly added
  // need to return array of task ids
  // promise to update task group
  const delTaskGroupPromise = TaskGroup.update(
    { task_group_name: taskGroupName, pax: pax },
    { where: { group_id: taskGroupId } }
  );
  // promise to delete relevant tasks (TODO)
  const deleteTaskPromise = Task.destroy({ where: { task_id: taskIdArr } });

  const deletionPromiseArr = [delTaskGroupPromise, deleteTaskPromise];

  // array of promises to add new tasks
  const taskCreationPromiseArr = taskArrJSON.map((x) =>
    Task.create({ task_JSON: JSON.stringify(x) })
      .then((result) => {
        let out = JSON.parse(result.task_JSON);
        out.taskId = result.task_id;
        out.taskGroupId = taskGroupId;
        tmp = JSON.stringify(out);
        Task.update({ task_JSON: tmp }, { where: { task_id: result.task_id } });
        return out;
        // result is now a taskJSON object
      })
      .then((result) => {
        outTaskIdArray.push(result.taskId);
        taskJSONArray.push(result);
      })
  );

  const relationPromisesArr = [];
  return Promise.all([...deletionPromiseArr, ...taskCreationPromiseArr])
    .then(() => {
      taskJSONArray.map((taskJSON) => {
        // note: no need to update projects task groups table as task group itself is not deleted; no need to update people projects table as personnel is still in project
        // add to projects tasks table
        relationPromisesArr.push(
          ProjectTask.create({
            project_id: projectId,
            task_id: taskJSON.taskId,
          })
        );
        // add to task groups tasks table
        relationPromisesArr.push(
          TaskGroupTask.create({
            group_id: taskGroupId,
            task_id: taskJSON.taskId,
          })
        );
        // add to people tasks table
        if (taskJSON.personId !== null) {
          relationPromisesArr.push(
            PersonTask.findOrCreate({
              where: {
                user_id: Number(taskJSON.personId),
                task_id: taskJSON.taskId,
              },
            })
          );
          // add to people taskgroups table
          relationPromisesArr.push(
            PersonTaskGroup.findOrCreate({
              where: {
                user_id: taskJSON.personId,
                group_id: taskJSON.taskGroupId,
              },
            })
          );
        }
      });
    })
    .then(() => {
      return Promise.all(relationPromisesArr);
    })
    .then(() =>
      res.status(201).json({
        success: "successfully updated task group",
        idArray: outTaskIdArray,
      })
    )
    .catch((err) =>
      res
        .status(401)
        .json({ error: "failed to update task group successfully" })
    );
};

module.exports = {
  // PUTTaskUser,
  // DELETETaskUser,
  // PATCHTaskUser,
  PUTTaskGroupUser,
  DELETETaskGroupUser,
  PATCHTaskGroupUser,
};
