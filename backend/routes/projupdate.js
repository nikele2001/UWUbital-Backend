const path = require("path");

const express = require("express");

const router = express.Router();

const {
  PUTPersonUser,
  DELETEPersonUser,
  PATCHPersonUser,
  PUTTaskUser,
  DELETETaskUser,
  PATCHTaskUser,
  PUTTaskGroupUser,
  DELETETaskGroupUser,
  PATCHTaskGroupUser,
  PUTAvailUser,
  DELETEAvailUser,
  PATCHAvailUser,
  runUser,
} = require("./../controllers/userProjUpdateController");

router.put("/person", PUTPersonUser);

router.delete("/person", DELETEPersonUser);

router.patch("/person", PATCHPersonUser);

router.put("/task", PUTTaskUser);

router.delete("/task", DELETETaskUser);

router.patch("/task", PATCHTaskUser);

router.put("/taskgroup", PUTTaskGroupUser);

router.delete("/taskgroup", DELETETaskGroupUser);

router.patch("/taskgroup", PATCHTaskGroupUser);

router.put("/avail", PUTAvailUser);

router.delete("/avail", DELETEAvailUser);

router.patch("/avail", PATCHAvailUser);

router.post("/run", runUser);

module.exports = router;
