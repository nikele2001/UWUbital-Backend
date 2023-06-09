const path = require("path");

const express = require("express");

const router = express.Router();

const { getMyTasksUser } = require("./../controllers/userMyTasksController");

router.post("/getmytasks", getMyTasksUser);

module.exports = router;
