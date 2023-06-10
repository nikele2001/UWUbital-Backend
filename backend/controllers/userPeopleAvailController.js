require("dotenv").config();

// import statements for models and object TODO
const PUTPersonUser = async (req, res, next) => {
  const { username, proj_id, role } = req.body;
  if (!username || !proj_id || !role) {
    return res.status(403).json({
      error:
        "username, project ID and role are required for adding person to project",
    });
  }
  try {
    // add add person logic
  } catch (err) {
    return res.status(401).json({ error: err });
  }
};

const DELETEPersonUser = async (req, res, next) => {
  const { username, proj_id } = req.body;
  if (!username || !proj_id) {
    return res.status(403).json({
      error:
        "username and project ID are required for removing person from project",
    });
  }
  try {
    // add remove person logic
  } catch (err) {
    return res.status(401).json({ error: err });
  }
};

const PATCHPersonUser = async (req, res, next) => {
  const { username, proj_id, role } = req.body;
  if (!username || !proj_id || !role) {
    return res.status(403).json({
      error:
        "username, project ID and role are required for editing person in project",
    });
  }
  try {
    // add edit person logic
  } catch (err) {
    return res.status(401).json({ error: err });
  }
};

const PUTAvailUser = async (req, res, next) => {
  const { user_id, project_id, avail_JSON } = req.body;
  if (!user_id || !project_id || !avail_JSON) {
    return res.status(403).json({
      error:
        "User ID, Project ID and avail_JSON are required for adding avail in project",
    });
  }
  try {
    // add add avail logic
  } catch (err) {
    return res.status(401).json({ error: err });
  }
};

const DELETEAvailUser = async (req, res, next) => {
  const { avail_id } = req.body;
  if (!avail_id) {
    return res.status(403).json({
      error: "Avail ID is required for removing avail in project",
    });
  }
  try {
    // add delete avail logic
  } catch (err) {
    return res.status(401).json({ error: err });
  }
};

const PATCHAvailUser = async (req, res, next) => {
  const { user_id, project_id, avail_JSON, avail_id } = req.body;
  if (!user_id || !project_id || !avail_JSON || !avail_id) {
    return res.status(403).json({
      error:
        "User ID, Project ID, Avail ID and avail_JSON are required for updating avail in project",
    });
  }
  try {
    // add update avail logic
  } catch (err) {
    return res.status(401).json({ error: err });
  }
};

module.exports = {
  PUTPersonUser,
  DELETEPersonUser,
  PATCHPersonUser,
  PUTAvailUser,
  DELETEAvailUser,
  PATCHAvailUser,
};
