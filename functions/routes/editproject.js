const path = require("path");

const express = require("express");

const router = express.Router();

const { retrieveProjUser } = require("./../controllers/userEditProjController");

router.post("/retrieveproject", retrieveProjUser);

module.exports = router;
