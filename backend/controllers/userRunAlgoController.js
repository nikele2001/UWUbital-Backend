require("dotenv").config();
// import statements for models and object TODO
const Person = require("./../algorithm/Person");
const { Project } = require("./../algorithm/Project");
const TaskGroup = require("./../algorithm/TaskGroup");
const Task = require("./../algorithm/Task");
const Algo = require("./../algorithm/greedy-algo1");

// return a project: projectJSONable
const runUser = async (req, res, next) => {
  const { project } = req.body;
  if (!project) {
    return res
      .status(403)
      .json({ error: "projectJSONable is required to run algorithm!" });
  }
  const projectobj = Project.fromJSONable(project);

  return res.status(201).json({
    success: "algorithm has completed execution",
    projectJSONable: Algo.runGreedyAlgorithm(projectobj, 3).toJSONable(),
  });
};

module.exports = { runUser };
