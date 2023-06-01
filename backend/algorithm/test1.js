require("dotenv").config();

const testfn = require('./testfn');
const algo = require('./greedy-algo1');
const ProjectData = require("./../models/ProjectData");

ProjectData.findOne({
    username: "nikele",
    projectname: "Testcase1",
}).then(x => {
    console.log("data found");
    const projJSON = JSON.parse(x.projectdata);
    testfn(projJSON, algo);
})