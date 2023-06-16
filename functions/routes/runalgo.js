const path = require("path");

const express = require("express");

const router = express.Router();

const { runUser } = require("./../controllers/userRunAlgoController");

router.post("/run", runUser);

module.exports = router;
