require("dotenv").config();

const {Project} = require('./Project');
const testfn = require('./testfn');
const algo = require('./greedy-algo1');
// const ProjectData = require("./../models/ProjectData");

const projJSON = new Project(0, "", [], []);
// console.log(project);
// const project = ProjectJSONable.fromJSONable(projJSON);
testfn(projJSON, algo, true);
