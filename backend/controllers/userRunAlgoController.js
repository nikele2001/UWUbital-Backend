require("dotenv").config();
// import statements for models and object TODO
const Person = require("./../algorithm/Person");
const { Project } = require("./../algorithm/Project");
const TaskGroup = require("./../algorithm/TaskGroup");
const Task = require("./../algorithm/Task");
const Algo = require("./../algorithm/greedy-algo1");

// return a project: projectJSONable
const runUser = async (req, res, next) => {
  const { projectJSONable } = req.body;
  if (!projectJSONable) {
    return res
      .status(403)
      .json({ error: "projectJSONable is required to run algorithm!" });
  }
  const project = Project.fromJSONable(projectJSONable);

  return res.status(201).json({
    success: "algorithm has completed execution",
    projectJSONable: Algo.runGreedyAlgorithm(project, 3).toJSONable(),
  });
};

module.exports = { runUser };
