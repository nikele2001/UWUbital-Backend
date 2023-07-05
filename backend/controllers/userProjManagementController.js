require("dotenv").config();
const sequelize = require("../util/database");
const Sequelize = require("sequelize");
// import statements for models and object TODO
const { TaskGroupJSONable } = require("./../algorithm/TaskGroupJSONable");
const { TaskJSONable } = require("./../algorithm/TaskJSONable");
const { Person: PersonO } = require("./../algorithm/Person");
const { PersonJSONable } = require("./../algorithm/PersonJSONable");
const { Project: ProjectO } = require("./../algorithm/Project");
const { ProjectJSONable } = require("./../algorithm/ProjectJSONable");
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
  const { personId } = req.body;
  if (!personId) {
    return res.status(403).json({
      error: "user_id is required for getting your projects!",
    });
  }
  try {
    // {project_id, user_id, avail_JSON, permission}
    const projOS = PersonProject.findAll({
      attributes: [
        [Sequelize.fn("DISTINCT", Sequelize.col("project_id")), "project_id"],
        "permission",
      ],
      where: { user_id: personId },
    });
    const projIds = projOS.then((x) => x.map((y) => y.project_id));
    // {project_name, project_id}
    const projOS2 = projIds.then((x) =>
      Project.findAll({
        where: { project_id: x },
      })
    );
    const out = await Promise.all([projOS, projOS2]).then((array) => {
      const projOS = array[0];
      const projOS2 = array[1];
      const owned = projOS
        .filter((x) => x.permission === "owner")
        .map((x) => projOS2.filter((y) => y.project_id === x.project_id)[0])
        .map((x) => {
          return { projectName: x.project_name, projectId: x.project_id };
        });
      const unowned = projOS
        .filter((x) => x.permission !== "owner")
        .map((x) => projOS2.filter((y) => y.project_id === x.project_id)[0])
        .map((x) => {
          return { projectName: x.project_name, projectId: x.project_id };
        });
      return { owned: owned, unowned: unowned };
    });
    return res.status(201).json({ projects: out });
  } catch (err) {
    return res.status(401).json({ error: err });
  }
};

const PUTProjectUser = async (req, res, next) => {
  const { personId, projectName } = req.body;
  if (!personId || !projectName) {
    return res.status(403).json({
      error: "username and project name are required for creating new project",
    });
  }
  // add create project logic
  const newProj = await Project.create({
    project_name: projectName,
  }).then((result) => {
    PersonProject.create({
      project_name: projectName,
      user_id: personId,
      permission: "owner",
      project_id: result.project_id,
      // availability_start: "2023-06-12 08:05:45.000000",
      // availability_end: "2023-06-12 08:05:45.000000",
    })
      .then(() => {
        console.log("project created successfully");
        return res
          .status(201)
          .json({ success: "project created!", projectId: result.project_id });
      })
      .catch((err) => {
        console.log(err);
        return res.status(401).json({ error: "project creation failed" });
      });
  });
};

const PATCHProjectUser = async (req, res, next) => {
  const { projectId, projectName } = req.body;
  if (!projectId || !projectName) {
    return res.status(403).json({
      error: "username and project name are required for editing project name",
    });
  }
  // add edit project name logic
  let project = await Project.findOne({ where: { project_id: projectId } });
  if (!project) {
    return res.status(404).json({ error: "Project not found" });
  }
  Project.update(
    { project_name: projectName },
    { where: { project_id: projectId } }
  ).then(() => {
    return res.status(201).json({
      success: `project name changed successfully to ${projectName}!`,
    });
  });
};

const POSTProjectUser = async (req, res, next) => {
  const { personId, projectId } = req.body;
  if (!personId || !projectId) {
    return res.status(403).json({
      error: "user id and project id are required for getting project details",
    });
  }
  // check if project exists
  const proj = await Project.findOne({ where: { project_id: projectId } });
  if (proj === null) {
    return res.status(404).json({ error: "project not found" });
  }
  // check if user has viewing rights (PersonProject)
  const user = await PersonProject.findOne({
    where: {
      user_id: personId,
      project_id: projectId,
    },
  });

  if (user === null) {
    return res.status(403).json({ error: "user does not have viewing rights" });
  }
  // get promise array of task group ids that belong to the project (ProjectTaskGroup)
  const taskGroupIds = ProjectTaskGroup.findAll({
    where: { project_id: projectId },
  }).then((x) => x.map((y) => y.group_id));
  // taskGroups is promise array of taskgroups
  const taskGroups = taskGroupIds.then((idarr) =>
    TaskGroup.findAll({
      where: { group_id: idarr },
    })
  );

  const taskIds = taskGroupIds
    .then((idarr) =>
      TaskGroupTask.findAll({
        where: { group_id: idarr },
      })
    )
    .then((x) => x.map((y) => y.task_id));

  const tasks = taskIds.then((idarr) =>
    Task.findAll({
      where: { task_id: idarr },
    })
  );

  const userRows = PersonProject.findAll({
    where: { project_id: projectId },
  });

  const userIds = userRows.then((x) => x.map((y) => y.user_id));

  const users = userIds.then((idarr) =>
    Person.findAll({
      where: { user_id: idarr },
    })
  );

  const projName = Project.findOne({
    where: { project_id: projectId },
  }).then((x) => x.project_name);

  return await Promise.all([taskGroups, tasks, users, projName, userRows])
    .then((array) => {
      // {group_id, task_group_name, pax}
      const taskGroups = array[0];
      // {task_JSON (string), task_id}
      const tasksStr = array[1];
      const tasks = tasksStr.map((x) => {
        return { taskId: x.task_id, taskJSON: JSON.parse(x.task_JSON) };
      });
      // {user_id, user_name, password_hash, jwt_token, bio}
      const users = array[2];
      const projName = array[3];
      // {relation_id, permission, avail_JSON (one only, string), user_id, project_id}
      const availRaw = array[4];
      const outPeople = users.map((userEntry) => {
        const halfway = availRaw.filter(
          (x) => x.user_id === userEntry.user_id && x.avail_JSON != null
        );
        const availJSONs = halfway.map((x) => JSON.parse(x.avail_JSON));
        const role = availRaw.filter((x) => x.user_id === userEntry.user_id)[0]
          .permission;
        return new PersonJSONable(
          userEntry.user_id,
          userEntry.user_name,
          availJSONs,
          role
        );
      });
      const outTGs = taskGroups.map((tgo) => {
        console.log(tasks);
        const outTasks = tasks
          .filter((x) => x.taskJSON.taskGroupId === tgo.group_id)
          .map((x) => x.taskJSON)
          .map(
            (taskJSON) =>
              new TaskJSONable(
                taskJSON.taskId,
                taskJSON.interval,
                taskJSON.personId,
                taskJSON.isCompleted,
                taskJSON.projectId,
                taskJSON.taskPriority,
                taskJSON.taskGroupId,
                taskJSON.isAssigned
              )
          );
        console.log(outTasks);
        return new TaskGroupJSONable(
          tgo.group_id,
          tgo.task_group_name,
          outTasks,
          tgo.pax
        );
      });
      return res.status(201).json({
        project: new ProjectJSONable(projectId, projName, outPeople, outTGs),
      });
    })
    .catch((err) => {
      console.log(err);
      return res
        .status(401)
        .json({ error: "error finding for tasks in task groups in project" });
    });
  // get all personnel info for the project (PersonProject)
};

const DELETEProjectUser = async (req, res, next) => {
  const { personId, projectId } = req.body;
  if (!personId || !projectId) {
    return res.status(403).json({
      error: "user id and project id are required for deleting project",
    });
  }

  const user = await PersonProject.findOne({
    where: { user_id: personId, project_id: projectId },
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
    where: { project_id: projectId },
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
    where: { project_id: projectId },
  });
  taskpromisearr = taskpromisearr.map(
    (x) => new Promise((resolve, reject) => resolve(x))
  );

  // deleting all tasks in project
  Promise.all(taskpromisearr).then(async (result) => {
    for (let i = 0; i < result.length; i++) {
      await Task.destroy({ where: { task_id: result[i].task_id } });
      console.log("delete success");
    }
  });

  // deleting the project itself
  await Project.destroy({ where: { project_id: projectId } })
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
