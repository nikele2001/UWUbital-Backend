require("dotenv").config();
const db = require("../util/database");
const sequelize = require("../util/database");
// const task = require("./../models/Task");
// const taskJSONable = require("./../models/taskJSONable");
const { Op } = require("sequelize");

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
    const user = await Person.findOne({ where: { user_id: user_id } });
    if (!user) {
      return res.status(404).json({ error: "user_id not found" });
    }
    // idarr is the array of project ids
    const idarr = PersonProject.findAll({
      attributes: [
        [sequelize.fn("DISTINCT", sequelize.col("project_id")), "project_id"],
      ],
      where: { user_id: user_id },
    }).then((projidarr) => projidarr.map((x) => x.project_id));
    // projArr is the Promise array of project objs
    const projArr = idarr.then(
      async (idarr) =>
        await Project.findAll({
          attributes: [
            [
              sequelize.fn("DISTINCT", sequelize.col("project_id")),
              "project_id",
            ],
          ],
          where: { project_id: idarr },
        })
    );
    // array of task id promises
    const taskIds = PersonTask.findAll({
      attributes: [
        [sequelize.fn("DISTINCT", sequelize.col("task_id")), "task_id"],
      ],
      where: { user_id: user_id },
    });
    // array of task promises
    const tasks = taskIds.then((idarr) =>
      Task.findAll({
        where: { task_id: idarr },
      })
    );
    // array of taskgroupid promises
    const taskGroupIds = taskIds.then((idarr) =>
      TaskGroupTask.findAll({
        attributes: [
          [sequelize.fn("DISTINCT", sequelize.col("group_id")), "group_id"],
        ],
        where: { task_id: idarr },
      })
    );
    // array of taskgroup promises
    const taskgroup = taskGroupIds.then((idarr) =>
      TaskGroup.findAll({
        where: { group_id: idarr },
      })
    );
    return await Promise.all([projArr, tasks, taskgroup]).then((array) => {
      const projs = array[0];
      const tasks = array[1];
      const taskGroups = array[2];
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
  } catch (err) {
    console.log(err);
    return res.status(401).json({ error: err });
  }
};

module.exports = { getMyTasksUser };
