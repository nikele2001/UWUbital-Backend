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
  const { personId } = req.body;
  if (!personId) {
    return res.status(403).json({
      error: "personId is required for getting your tasks!",
    });
  }
  try {
    const user = await Person.findOne({ where: { user_id: personId } });
    if (!user) {
      return res.status(404).json({ error: "personId not found" });
    }
    // idarr is the array of project ids
    const idarr = PersonProject.findAll({
      attributes: [
        [sequelize.fn("DISTINCT", sequelize.col("project_id")), "project_id"],
      ],
      where: { user_id: personId },
    }).then((projidarr) => projidarr.map((x) => x.project_id));
    // projArr is the Promise array of project objs
    const projArr = idarr.then((idarr) =>
      Project.findAll({
        attributes: [
          [sequelize.fn("DISTINCT", sequelize.col("project_id")), "project_id"],
          [sequelize.col("project_name"), "project_name"],
        ],
        where: { project_id: idarr },
      })
    );
    // array of task id promises
    const taskIds = PersonTask.findAll({
      attributes: [
        [sequelize.fn("DISTINCT", sequelize.col("task_id")), "task_id"],
      ],
      where: { user_id: personId },
    }).then((idarr) => idarr.map((x) => x.task_id));
    // array of task promises
    const tasks = taskIds.then((idarr) =>
      Task.findAll({
        where: { task_id: idarr },
      })
    );
    // array of taskgroupid promises
    const taskGroupIds = taskIds
      .then((idarr) =>
        TaskGroupTask.findAll({
          attributes: [
            [sequelize.fn("DISTINCT", sequelize.col("group_id")), "group_id"],
          ],
          where: { task_id: idarr },
        })
      )
      .then((idarr) => idarr.map((x) => x.group_id));
    // array of taskgroup promises
    const taskgroup = taskGroupIds.then((idarr) =>
      TaskGroup.findAll({
        where: { group_id: idarr },
      })
    );
    return await Promise.all([projArr, tasks, taskgroup]).then((array) => {
      const projs = array[0];
      const tasks = array[1];
      // {task_group_name, pax, group_id}
      const taskGroups = array[2];
      const outArr = [];
      let index = 0;
      for (const task of tasks) {
        const tc = JSON.parse(task.task_JSON);
        console.log(taskGroups);
        console.log(tc);
        taskGroups.map((x) => console.log(x.group_id));
        const tg = taskGroups.filter(
          (x) => Number(x.group_id) === Number(tc.taskGroupId)
        )[0];
        console.log(tg);
        const tgCopy = {
          taskGroupId: tg.group_id,
          taskGroupName: tg.task_group_name,
          tasks: [tc],
          pax: tg.pax,
          priority: 1,
        };
        const projName = projs.filter(
          (x) => Number(x.project_id) === Number(tc.projectId)
        )[0].project_name;
        outArr[index] = { projectName: projName, taskGroup: tgCopy };
        index++;
      }
      return res.status(201).json({ success: "success", tasks: outArr });
    });
  } catch (err) {
    console.log(err);
    return res.status(401).json({ error: err });
  }
};

module.exports = { getMyTasksUser };
