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
  // try {
    // query people project for project name
    // query people task group for task groups
    // query people task for tasks
    // console.log("bleh");=
    const user = await Person.findOne({ where: { user_id: user_id } });
    if (!user) {
      return res.status(404).json({ error: "user_id not found" });
    }

    // idarr is the array of project ids
    const idarr = await PersonProject.findAll({
      attributes: [
        [sequelize.fn("DISTINCT", sequelize.col("project_id")), "project_id"],
      ],
      where: { user_id: user_id },
    }).then((projidarr) => projidarr.map((x) => x.project_id));

    //nameoutarr is the Promise array of project names
    const nameoutarr = idarr.map((id) =>
      Project.findOne({ where: { project_id: id } })
    );
    // array of task ids
    const taskIds = await PersonTask.findAll({
      attributes: [
        [sequelize.fn("DISTINCT", sequelize.col("task_id")), "task_id"],
      ],
      where: { user_id: user_id },
    });
    // query for tasks one by one (possible optimisation?)
    // array of task promises
    const tasks = taskIds.map(async (taskId) => Task.findOne({ where: { task_id: taskId } }));
    console.log(tasks);
    // array of taskgroupid promises
    const taskGroupIds = taskIds.map(async (taskId) =>
      TaskGroupTask.findOne({ where: { task_id: await taskId } })
    );
    // array of taskgroups promises
    const taskgroup = taskGroupIds.map(async (taskGroupId) => {
      const id = await taskGroupId;
      return TaskGroup.findOne({ where: { group_id: id } });
    });
    Promise.all([
      Promise.all(nameoutarr),
      Promise.all(tasks),
      Promise.all(taskgroup),
    ]).then((fuckyou) => {
      const projs = fuckyou[0];
      const tasks = fuckyou[1];
      const taskGroups = fuckyou[2];
      const outArr = [];
      const index = 0;
      for (const task of tasks) {
        const tc = JSON.parse(task.task_JSON);
        const tg = taskGroups.filter((x) => x.group_id === task.group_id)[0];
        const tgCopy = {
          id: tg.group_id,
          name: tg.task_name,
          tasks: [tc],
          pax: tg.pax,
          priority: 1,
        };
        const projName = projs.filter((x) => x.project_id === tc.proj_id)[0]
          .project_name;
        outArr[index] = { projName: projName, taskGroup: tgCopy };
        index++;
      }
      console.log(outArr);
      return res.status(201).json({ success: "success", tasks: outArr });
    });

    // query people task table to see relevant task id
    // query project task table to see relevant project name
  // } catch (err) {
  //   return res.status(401).json({ error: err });
  // }
};

module.exports = { getMyTasksUser };
