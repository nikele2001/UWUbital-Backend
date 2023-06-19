require("dotenv").config();
// import statements for models and object TODO
const { Project } = require("./../algorithm/Project");
const Algo = require("./../algorithm/greedy-algo1");

const Task = require("./../models/tasks");
const Person = require("./../models/people");
const { PersonTaskGroup, PersonTask } = require("../models/relations");

// return a project: projectJSONable
const runUser = async (req, res, next) => {
  const { project } = req.body;
  if (!project) {
    return res
      .status(403)
      .json({ error: "projectJSONable is required to run algorithm!" });
  }
  try {
    proj = Project.fromJSONable(project);
  } catch (err) {
    return res.status(401).json({ error: "project is not JSONable" });
  }

  // a projectJSONable after running algorithm
  const finalAssignments = Algo.runGreedyAlgorithm(proj, 3).toJSONable();
  // all assigned tasks in the project (including preassignments)
  const assignedTaskGroups = finalAssignments.taskGroups.map((x) => {
    const taskarr = x.tasks;
    x.useridarr = [];
    taskarr.map((y) => {
      x.useridarr.push(y.user_id);
      return y;
    });
    return x;
  });
  // console.log(assignedTaskGroups);

  // update people task group table
  // ppltgpromisearr is an array of promises of updates to people task groups table
  const ppltgpromisearr = [];
  for (let i = 0; i < assignedTaskGroups.length; i++) {
    const tmp = assignedTaskGroups[i];
    ppltgpromisearr[i] = PersonTaskGroup.findOrCreate({
      where: { group_id: tmp.id, user_id: tmp.useridarr },
    });
  }

  const taskarr = assignedTaskGroups
    .map((x) => x.tasks)
    .reduce((a, b) => a.concat(b), []);
  console.log(taskarr);

  // update personTask based on new information
  // ppltaskpromisearr is an array of promise of updates to the people tasks table
  const ppltaskpromisearr = [];
  // taskpromisearr is an array of promise of updates to the tasks table
  const taskpromisearr = [];
  for (let i = 0; i < taskarr.length; i++) {
    const tmp = taskarr[i];
    ppltaskpromisearr[i] = PersonTask.update(
      { user_id: tmp.user_id },
      { where: { task_id: tmp.task_id } }
    );
    taskpromisearr[i] = Task.findByPk(tmp.task_id)
      .then((result) => {
        console.log("found");
        return result;
      })
      .then((result) => {
        result.taskJSON = JSON.stringify(tmp);
        result.save();
      });
    // Task.update(
    //   { Task_JSON: JSON.stringify(tmp) },
    //   { where: { task_id: tmp.task_id } }
    // );
  }

  console.log("updating people task group table");
  await Promise.all(ppltgpromisearr)
    .then(() => {
      console.log("updating people task table");
      return Promise.all(ppltaskpromisearr);
    })
    .then(() => {
      console.log("updating task table");
      return Promise.all(taskpromisearr);
    })
    .then(() =>
      res.status(201).json({
        success: "algorithm has completed execution",
        projectJSONable: finalAssignments,
      })
    )
    .catch((error) =>
      res.status(401).json({ error: "cannot save auto-assignments to DB" })
    );
};

module.exports = { runUser };
