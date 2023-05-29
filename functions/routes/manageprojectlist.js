const path = require("path");

const express = require("express");

const router = express.Router();

const {
  saveProjUser,
  deleteProjUser,
  getProjsUser,
} = require("./../controllers/userManageProjListController");

router.post("/saveproject", saveProjUser);

router.post("/deleteproject", deleteProjUser);

router.post("/getprojects", getProjsUser);

module.exports = router;
