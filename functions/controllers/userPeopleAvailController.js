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

// additional imports
const Avail = require("./../algorithm/Availability");
const AvailJSON = require("./../algorithm/AvailabilityJSONable");

// Add person into project
const PUTPersonUser = async (req, res, next) => {
  const { username, proj_id, role, proj_name } = req.body;
  if (!username || !proj_id || !role || !proj_name) {
    return res.status(403).json({
      error:
        "username, project ID and role are required for adding person to project",
    });
  }
  await Person.findOne({ where: { user_name: username } })
    .then(async (result) => {
      if (!result) {
        return res.status(404).json({ error: "person not found" });
      }
      const person = await PersonProject.findOne({
        where: { user_id: result.user_id, project_id: proj_id },
      });
      if (person !== null) {
        return res
          .status(403)
          .json({ error: "person already added to project" });
      }
      PersonProject.create({
        project_id: proj_id,
        project_name: proj_name,
        permission: role,
        user_id: result.user_id,
      });
      return res
        .status(201)
        .json({ success: "person added", user_id: result.user_id });
    })
    .catch((err) => {
      console.log(err);
      return res.status(401).json({ error: err });
    });
};

const DELETEPersonUser = async (req, res, next) => {
  const { user_id, proj_id } = req.body;
  if (!user_id || !proj_id) {
    return res.status(403).json({
      error:
        "user ID and project ID are required for removing person from project",
    });
  }
  await PersonProject.destroy({
    where: { user_id: user_id, project_id: proj_id },
  })
    .then(() =>
      res
        .status(201)
        .json({ success: "person deleted from project successfully" })
    )
    .catch(() =>
      res
        .status(401)
        .json({ error: "person unable to be deleted from project" })
    );
};

const PATCHPersonUser = async (req, res, next) => {
  const { user_id, proj_id, role } = req.body;
  if (!user_id || !proj_id || !role) {
    return res.status(403).json({
      error:
        "user ID, project ID and role are required for editing person in project",
    });
  }
  // add edit person logic
  let person = await PersonProject.findOne({
    where: { project_id: proj_id, user_id: user_id },
  });
  if (!person || person.permission === "owner") {
    throw new Error("eatshitflykite");
  }

  await PersonProject.update(
    { permission: role },
    { where: { project_id: proj_id, user_id: user_id } }
  ).then(() => {
    return res.status(201).json({
      success: `User permission editted successfully to ${role}!`,
    });
  });
};

// add availability to person
const PUTAvailUser = async (req, res, next) => {
  const { user_id, project_id, avail_JSON } = req.body;
  if (!user_id || !project_id || !avail_JSON) {
    return res.status(403).json({
      error:
        "User ID, Project ID and avail_JSON are required for adding avail in project",
    });
  }
  const newAvail = await PersonProject.findOne({
    where: { user_id: user_id, project_id: project_id },
  });

  if (newAvail === null) {
    return res.status(404).json({ error: "user not found" });
  }
  await PersonProject.findOne({
    where: { user_id: user_id, project_id: project_id },
  })
    .then((result) => {
      return PersonProject.create({
        permission: result.permission,
        avail_JSON: JSON.stringify(avail_JSON),
        user_id: user_id,
        project_id: project_id,
      });
    })
    .then(async (result) => {
      console.log("adding avail IDs to availJSON...");
      let new_result = JSON.parse(result.avail_JSON);
      new_result.id = result.relation_id;
      // console.log(new_result);
      new_result = JSON.stringify(new_result);
      await PersonProject.update(
        { avail_JSON: new_result },
        { where: { relation_id: result.relation_id } }
      );
      return result;
    })
    .then((result) => {
      return res.status(201).json({
        success: `added user's availability successfully`,
        avail_id: result.relation_id,
      });
    })
    .catch((err) => {
      return res.status(401).json({ error: err });
    });
};

const DELETEAvailUser = async (req, res, next) => {
  const { avail_id } = req.body;
  if (!avail_id) {
    return res.status(403).json({
      error: "Avail ID is required for removing avail in project",
    });
  }
  await PersonProject.destroy({ where: { relation_id: avail_id } })
    .then(() =>
      res.status(201).json({ success: "availability deleted successfully" })
    )
    .catch((err) =>
      res.status(401).json({ error: "Availability unable to be deleted" })
    );
};

const PATCHAvailUser = async (req, res, next) => {
  const { user_id, project_id, avail_JSON, avail_id } = req.body;
  if (!user_id || !project_id || !avail_JSON || !avail_id) {
    return res.status(403).json({
      error:
        "User ID, Project ID, Avail ID and avail_JSON are required for updating avail in project",
    });
  }
  const searchCond = {
    relation_id: avail_id,
    user_id: user_id,
    project_id: project_id,
  };
  let avail = await PersonProject.findOne({ where: searchCond });
  if (!avail) {
    return res.status(404).json({ error: "availability not found" });
  }
  // console.log("avail found");
  PersonProject.update(
    { avail_JSON: JSON.stringify(avail_JSON) },
    { where: searchCond }
  )
    // .then(async (result) => {
    //   console.log("adding avail IDs to availJSON...");
    //   console.log(result.avail_JSON);
    //   let new_result = JSON.parse(result.avail_JSON);
    //   new_result.relation_id = result.relation_id;
    //   new_result = JSON.stringify(new_result);
    //   await PersonProject.update(
    //     { avail_JSON: new_result },
    //     { where: { relation_id: result.relation_id } }
    //   );
    //   return result;
    // })
    .then(() => {
      return res
        .status(201)
        .json({ success: `availability changed successfully!` });
    })
    .catch((err) => {
      return res.status(401).json({ error: err });
    });
};

module.exports = {
  PUTPersonUser,
  DELETEPersonUser,
  PATCHPersonUser,
  PUTAvailUser,
  DELETEAvailUser,
  PATCHAvailUser,
};
