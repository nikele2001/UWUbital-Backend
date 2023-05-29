/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
const functions = require("firebase-functions");
// Imports
// require("dotenv").config();
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

// import routes
const loginSignupRoutes = require("./routes/loginsignup");
const editProjectRoutes = require("./routes/editproject");
const manageProjectListRoutes = require("./routes/manageprojectlist");

const app = express();

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

// app.set("Access-Control-Allow-Origin", "*");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
// app.use(cors());

app.get("/", async (req, res, next) => {
  console.log("This always runs!");
  res.send("Backend is running at port 4000! - Purple Dog Orbital Project '23");
});

app.use(loginSignupRoutes);
app.use(editProjectRoutes);
app.use(manageProjectListRoutes);

// Creating connection to listen for HTTP requests
mongoose
  .connect(
    "mongodb+srv://purpledog:purpledog@cluster0.agpgif4.mongodb.net/purpledogdb?retryWrites=true&w=majority"
  )
  .then(() => {
    app.listen(4000);
    console.log(`Running on port 4000...`);
  })
  .catch((err) => {
    console.log(err);
  });

exports.app = functions.https.onRequest(app);
