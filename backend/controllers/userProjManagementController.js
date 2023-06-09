require("dotenv").config();

// import statements for models and object TODO

const getProjsUser = async (req, res, next) => {
  const { user_id } = req.body;
  if (!user_id) {
    return res.status(403).json({
      error: "user_id is required for getting your projects!",
    });
  }
  try {
    // add getprojects logic
  } catch (err) {
    return res.status(401).json({ error: err });
  }
};

const PUTProjectUser = async (req, res, next) => {
  const { user_id, proj_name } = req.body;
  if (!user_id || !proj_name) {
    return res.status(403).json({
      error: "username and project name are required for creating new project",
    });
  }
  try {
    // add create project logid
  } catch (err) {
    return res.status(401).json({ error: err });
  }
};

const PATCHProjectUser = async (req, res, next) => {
  const { user_id, proj_name } = req.body;
  if (!user_id || !proj_name) {
    return res.status(403).json({
      error: "username and project name are required for editing project name",
    });
  }
  try {
    // add edit project name logic
  } catch (err) {
    return res.status(401).json({ error: err });
  }
};

const POSTProjectUser = async (req, res, next) => {
  const { user_id, proj_name } = req.body;
  if (!user_id || !proj_name) {
    return res.status(403).json({
      error:
        "username and project name are required for getting project details",
    });
  }
  try {
    // add getting project details logic
  } catch (err) {
    return res.status(401).json({ error: err });
  }
};

const DELETEProjectUser = async (req, res, next) => {
  const { user_id, proj_name } = req.body;
  if (!user_id || !proj_name) {
    return res.status(403).json({
      error: "username and project name are required for deleting project",
    });
  }
  try {
    // add delete project logic
  } catch (err) {
    return res.status(401).json({ error: err });
  }
};

module.exports = {
  getProjsUser,
  PUTProjectUser,
  PATCHProjectUser,
  POSTProjectUser,
  DELETEProjectUser,
};
