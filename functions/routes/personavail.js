const path = require("path");

const express = require("express");

const router = express.Router();

const {
  PUTPersonUser,
  DELETEPersonUser,
  PATCHPersonUser,
  PUTAvailUser,
  DELETEAvailUser,
  PATCHAvailUser,
} = require("./../controllers/userPeopleAvailController");

router.put("/person", PUTPersonUser);

router.delete("/person", DELETEPersonUser);

router.patch("/person", PATCHPersonUser);

router.put("/avail", PUTAvailUser);

router.delete("/avail", DELETEAvailUser);

router.patch("/avail", PATCHAvailUser);

module.exports = router;
