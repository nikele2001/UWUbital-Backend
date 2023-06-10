// Imports
require("dotenv").config();
const path = require("path");
const express = require("express");
// const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

// import routes
const loginSignupRoutes = require("./routes/loginsignup");
const myTasksRoutes = require("./routes/mytasks");
const personAvailRoutes = require("./routes/personavail");
const projManagementRoutes = require("./routes/projmanagement");
const runAlgoRoutes = require("./routes/runalgo");
const taskManagementRoutes = require("./routes/taskmanagement");

const app = express();

// connect to mySQL database
const db = require("./util/database");

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Vary", "Origin");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
// app.use(cors());

app.get("/", async (req, res, next) => {
  console.log("This always runs!");
  res.send("Backend is running at port 4000!");
});

app.use(loginSignupRoutes);
app.use(myTasksRoutes);
app.use(personAvailRoutes);
app.use(projManagementRoutes);
app.use(runAlgoRoutes);
app.use(taskManagementRoutes);

// Creating connection to listen for HTTP requests
app.listen(3000, () => {
  console.log(`Example app listening at http://localhost:3000`);
});
