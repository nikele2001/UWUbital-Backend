const path = require("path");

const express = require("express");

const router = express.Router();

const {
  getProjsUser,
  PUTProjectUser,
  PATCHProjectUser,
  POSTProjectUser,
  DELETEProjectUser,
} = require("./../controllers/userProjManagementController.js");

router.post("/getprojects", getProjsUser);

router.put("/project", PUTProjectUser);

router.patch("/project", PATCHProjectUser);

router.post("/project", POSTProjectUser);

router.delete("/project", DELETEProjectUser);

module.exports = router;
