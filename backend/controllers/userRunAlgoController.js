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
const Algo = require("./../algorithm/greedy-algo1");

// return a project: projectJSONable
const runUser = async (req, res, next) => {
  const { projectJSONable } = req.body;
  if (!projectJSONable) {
    return res
      .status(403)
      .json({ error: "projectJSONable is required to run algorithm!" });
  }
  // const project = Project.fromJSONable(projectJSONable);

  return res.status(201).json({
    success: "algorithm has completed execution",
    projectJSONable: Algo.runGreedyAlgorithm(projectJSONable).toJSONable(),
  });
};

module.exports = { runUser };
