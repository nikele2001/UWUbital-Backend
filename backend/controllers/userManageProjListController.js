require("dotenv").config();

const Projects = require("./../models/Projects");
const ProjectData = require("./../models/ProjectData");

const saveProjUser = async (req, res, next) => {
  // project data (in the form of JSON string) is still not being sent through request payload to the backend
  const { username, projectname, projectdata } = req.body;
  if (!username || !projectname) {
    return res
      .status(403)
      .json({
        error: "username and project name are required for saving project",
      });
  }
  try {
    await Projects.findOne({ username: username })
      .then((x) => {
        const checkProj = x.projectlist.find(
          (project) => project === projectname
        );
        if (typeof checkProj === "undefined") {
          Projects.findOneAndUpdate(
            { username: username },
            { projectlist: [...x.projectlist, projectname] },
            { upsert: true }
          ).exec();
        }
      })
      .then((x) => {
        const query = { username: username, projectname: projectname };
        ProjectData.findOneAndUpdate(query, req.body, { upsert: true }).exec();
      })
      .then((x) => {
        res.status(201).json({ success: "project creation/update success!" });
      });
  } catch (err) {
    return res.status(401).json({ error: err });
  }
};

const deleteProjUser = async (req, res, next) => {
  // delete from projects array, delete project entry from projectdata
  //rmb to delete from projdata
  const { username, projectname } = req.body;
  if (!username || !projectname) {
    return res
      .status(403)
      .json({
        error:
          "both username and project name are required for deleting project",
      });
  }
  try {
    await Projects.findOne({ username: username })
      .then((x) => {
        const tmp = x.projectlist.filter((x) => x !== projectname);
        // console.log(tmp);
        Projects.findOneAndUpdate(
          { username: username },
          { projectlist: tmp },
          { upsert: true }
        ).exec();
      })
      .then((x) => {
        ProjectData.deleteOne({
          username: username,
          projectname: projectname,
        }).exec();
      })
      .then((x) => {
        res.status(201).json({ success: "deletion success!" });
      });
  } catch (err) {
    return res.status(401).json({ error: err });
  }
};

const getProjsUser = async (req, res, next) => {
  const { username } = req.body;
  if (!username) {
    return res
      .status(403)
      .json({ error: "username is required for getting list of projects" });
  }
  try {
    await Projects.findOne({ username: username }).then((x) => {
      // console.log(x.projectlist);
      res.status(201).json({ projectlist: x.projectlist });
    });
    // res.status(201).json({projectlist: check.projectlist});
  } catch (err) {
    return res.status(401).json({ error: err });
  }
};

module.exports = { saveProjUser, deleteProjUser, getProjsUser };
