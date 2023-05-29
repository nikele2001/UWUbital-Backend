// Imports
require("dotenv").config();
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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
// app.use(cors());

app.get("/", async (req, res, next) => {
  console.log("This always runs!");
  res.send("Backend is running at port 4000!");
});

app.use(loginSignupRoutes);
app.use(editProjectRoutes);
app.use(manageProjectListRoutes);

// Creating connection to listen for HTTP requests
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT);
    console.log(`Running on port ${process.env.PORT}...`);
  })
  .catch((err) => {
    console.log(err);
  });
