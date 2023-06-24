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
  const { personName, projectId, role, projectName } = req.body;
  if (!personName || !projectId || !role || !projectName) {
    return res.status(403).json({
      error:
        "username, project ID and role are required for adding person to project",
    });
  }
  await Person.findOne({ where: { user_name: personName } })
    .then(async (result) => {
      if (!result) {
        return res.status(404).json({ error: "person not found" });
      }
      const person = await PersonProject.findOne({
        where: { user_id: result.user_id, project_id: projectId },
      });
      if (person !== null) {
        return res
          .status(403)
          .json({ error: "person already added to project" });
      }
      PersonProject.create({
        project_id: projectId,
        project_name: projectName,
        permission: role,
        user_id: result.user_id,
      });
      return res
        .status(201)
        .json({ success: "person added", personId: result.user_id });
    })
    .catch((err) => {
      console.log(err);
      return res.status(401).json({ error: err });
    });
};

const DELETEPersonUser = async (req, res, next) => {
  const { personId, projectId } = req.body;
  if (!personId || !projectId) {
    return res.status(403).json({
      error:
        "user ID and project ID are required for removing person from project",
    });
  }
  await PersonProject.destroy({
    where: { user_id: personId, project_id: projectId },
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
  const { personId, projectId, role } = req.body;
  if (!personId || !projectId || !role) {
    return res.status(403).json({
      error:
        "user ID, project ID and role are required for editing person in project",
    });
  }
  // add edit person logic
  let person = await PersonProject.findOne({
    where: { project_id: projectId, user_id: personId },
  });
  if (!person || person.permission === "owner") {
    return res.status(403).json({ error: "eatshitflykite" });
  }

  await PersonProject.update(
    { permission: role },
    { where: { project_id: projectId, user_id: personId } }
  ).then(() => {
    return res.status(201).json({
      success: `User permission editted successfully to ${role}!`,
    });
  });
};

// add availability to person
const PUTAvailUser = async (req, res, next) => {
  const { personId, projectId, availabilityJSON } = req.body;
  if (!personId || !projectId || !availabilityJSON) {
    return res.status(403).json({
      error:
        "User ID, Project ID and avail_JSON are required for adding avail in project",
    });
  }
  const newAvail = await PersonProject.findOne({
    where: { user_id: personId, project_id: projectId },
  });

  if (newAvail === null) {
    return res.status(404).json({ error: "user not found" });
  }
  await PersonProject.findOne({
    where: { user_id: personId, project_id: projectId },
  })
    .then((result) => {
      return PersonProject.create({
        permission: result.permission,
        avail_JSON: JSON.stringify(availabilityJSON),
        user_id: personId,
        project_id: projectId,
      });
    })
    .then(async (result) => {
      console.log("adding avail IDs to availJSON...");
      let new_result = JSON.parse(result.avail_JSON);
      new_result.availabilityId = result.relation_id;
      new_result = JSON.stringify(new_result);
      // console.log(new_result);
      await PersonProject.update(
        { avail_JSON: new_result },
        { where: { relation_id: result.relation_id } }
      );
      return result;
    })
    .then((result) => {
      return res.status(201).json({
        success: `added user's availability successfully`,
        availabilityId: result.relation_id,
      });
    })
    .catch((err) => {
      return res.status(401).json({ error: err });
    });
};

const DELETEAvailUser = async (req, res, next) => {
  const { availabilityId } = req.body;
  if (!availabilityId) {
    return res.status(403).json({
      error: "Avail ID is required for removing avail in project",
    });
  }
  await PersonProject.destroy({ where: { relation_id: availabilityId } })
    .then(() =>
      res.status(201).json({ success: "availability deleted successfully" })
    )
    .catch((err) =>
      res.status(401).json({ error: "Availability unable to be deleted" })
    );
};

const PATCHAvailUser = async (req, res, next) => {
  const { personId, projectId, availabilityJSON, availabilityId } = req.body;
  if (!personId || !projectId || !availabilityJSON || !availabilityId) {
    return res.status(403).json({
      error:
        "User ID, Project ID, Avail ID and avail_JSON are required for updating avail in project",
    });
  }
  const searchCond = {
    relation_id: availabilityId,
    user_id: personId,
    project_id: projectId,
  };
  let avail = await PersonProject.findOne({ where: searchCond });
  if (!avail) {
    return res.status(404).json({ error: "availability not found" });
  }
  // console.log("avail found");
  PersonProject.update(
    { avail_JSON: JSON.stringify(availabilityJSON) },
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
