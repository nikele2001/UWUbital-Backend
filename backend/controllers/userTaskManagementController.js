require("dotenv").config();

const PUTTaskUser = async (req, res, next) => {
  const { project_id, group_id } = req.body;
  if (!project_id || !group_id) {
    return res.status(403).json({
      error: "group ID and project ID are required for adding task to project",
    });
  }
  try {
    // add add task logic
  } catch (err) {
    return res.status(401).json({ error: err });
  }
};

const DELETETaskUser = async (req, res, next) => {
  const { task_id } = req.body;
  if (!task_id) {
    return res.status(403).json({
      error: "task ID is required for deleting task from project",
    });
  }
  try {
    // add add task logic
  } catch (err) {
    return res.status(401).json({ error: err });
  }
};

const PATCHTaskUser = async (req, res, next) => {
  const { taskJSON } = req.body;
  if (!taskJSON) {
    return res.status(403).json({
      error: "task JSON is required for editing task in project",
    });
  }
  try {
    // add edit task logic
  } catch (err) {
    return res.status(401).json({ error: err });
  }
};

const PUTTaskGroupUser = async (req, res, next) => {
  const { project_id, pax, task_arr_JSON } = req.body;
  if (!project_id || !pax || !task_arr_JSON) {
    return res.status(403).json({
      error:
        "task array JSON, project ID and pax are required for editing task in project",
    });
  }
  try {
    // add add task group logic
  } catch (err) {
    return res.status(401).json({ error: err });
  }
};

const DELETETaskGroupUser = async (req, res, next) => {
  const { group_id } = req.body;
  if (!group_id) {
    return res.status(403).json({
      error: "Group ID is required for editing task in project",
    });
  }
  try {
    // add remove task group logic
  } catch (err) {
    return res.status(401).json({ error: err });
  }
};

const PATCHTaskGroupUser = async (req, res, next) => {
  const { group_id, pax, task_arr_JSON } = req.body;
  if (!group_id || !pax || !task_arr_JSON) {
    return res.status(403).json({
      error:
        "task array JSON, group ID and pax are required for editing task in project",
    });
  }
  try {
    // add update task group logic
  } catch (err) {
    return res.status(401).json({ error: err });
  }
};

module.exports = {
  PUTTaskUser,
  DELETETaskUser,
  PATCHTaskUser,
  PUTTaskGroupUser,
  DELETETaskGroupUser,
  PATCHTaskGroupUser,
};