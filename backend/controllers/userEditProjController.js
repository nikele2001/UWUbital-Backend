require("dotenv").config();

const ProjectData = require("./../models/ProjectData");

const retrieveProjUser = async (req, res, next) => {
  const { username, projectname } = req.body;
  if (!username || !projectname) {
    return res
      .status(403)
      .json({
        error: "username and project name are required for retrieving project",
      });
  }
  try {
    const check = await ProjectData.findOne({
      username: username,
      projectname: projectname,
    }).then((x) => {
      res.status(201).json({ projectdata: x.projectdata });
    });
  } catch (err) {
    return res.status(401).json({ error: err });
  }
};

module.exports = { retrieveProjUser };
