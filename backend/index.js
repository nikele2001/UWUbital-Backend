// Imports
require("dotenv").config();
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const sequelize = require("./util/database");
const createAssociations = require("./models/association");

/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// firebase imports
// const { onRequest } = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");
// const functions = require("firebase-functions");

// import routes
const loginSignupRoutes = require("./routes/loginsignup");
const myTasksRoutes = require("./routes/mytasks");
const personAvailRoutes = require("./routes/personavail");
const projManagementRoutes = require("./routes/projmanagement");
const runAlgoRoutes = require("./routes/runalgo");
const taskManagementRoutes = require("./routes/taskmanagement");

const app = express();
createAssociations.createAssociations();

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", async (req, res, next) => {
  console.log("This always runs!");
  res.send("Backend is running at port 4000!");
});

// use routes
app.use(loginSignupRoutes);
app.use(myTasksRoutes);
app.use(personAvailRoutes);
app.use(projManagementRoutes);
app.use(runAlgoRoutes);
app.use(taskManagementRoutes);

// Creating connection to listen for HTTP requests
sequelize
  .sync({ force: false })
  .then((result) => {
    console.log("Database and tables updated!");
  })
  .then(() => {
    app.listen(4000);
  })
  .then(() => {
    console.log("Example app listening at http://localhost:4000");
  });

// for firebase
// exports.app = functions.https.onRequest(app);
