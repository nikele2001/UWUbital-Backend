const path = require("path");

const express = require("express");

const router = express.Router();

const {
  PUTTaskUser,
  DELETETaskUser,
  PATCHTaskUser,
  PUTTaskGroupUser,
  DELETETaskGroupUser,
  PATCHTaskGroupUser,
} = require("./../controllers/userTaskManagementController");

// router.put("/task", PUTTaskUser);

// router.delete("/task", DELETETaskUser);

// router.patch("/task", PATCHTaskUser);

router.put("/taskgroup", PUTTaskGroupUser);

router.delete("/taskgroup", DELETETaskGroupUser);

router.patch("/taskgroup", PATCHTaskGroupUser);

module.exports = router;
