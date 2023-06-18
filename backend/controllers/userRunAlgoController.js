require("dotenv").config();
// import statements for models and object TODO
const { Project } = require("./../algorithm/Project");
const Algo = require("./../algorithm/greedy-algo1");

const Task = require("./../models/tasks");
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
  console.log(assignedTaskGroups);

  // update people task group table
  for (let i = 0; i < assignedTaskGroups.length; i++) {
    for (let j = 0; j < assignedTaskGroups[i].useridarr.length; j++) {
      await PersonTaskGroup.findOrCreate({
        where: {
          user_id: assignedTaskGroups[i].useridarr[j],
          group_id: assignedTaskGroups[i].id,
        },
      });
    }
  }

  // update Task, personTask based on new information
  const taskarr = assignedTaskGroups
    .map((x) => x.tasks)
    .reduce((a, b) => a.concat(b), []);
  console.log(taskarr);

  for (let i = 0; i < taskarr.length; i++) {
    await PersonTask.findOrCreate({
      where: {
        user_id: taskarr[i].user_id,
        task_id: taskarr[i].task_id,
      },
    }).then(
      async (result) =>
        await Task.update(
          { TaskJSON: JSON.stringify(taskarr[i]) },
          { where: { task_id: taskarr[i].task_id } }
        )
    );
  }

  return res.status(201).json({
    success: "algorithm has completed execution",
    projectJSONable: finalAssignments,
  });
};

module.exports = { runUser };
