const {Project} = require('./Project');
const math = require('mathjs');

// function to run on a project to test if it works, and how efficient it is.
function test(projJSON, algo, verbose) {
    console.log("Running test...");
    const original = Project.fromJSONable(projJSON);
    const algoed = algo(Project.fromJSONable(projJSON));

    console.log("Checking for validity... \n");
    if (original.people.length !== algoed.people.length) {
        console.log("Length of people list different: Original length: " 
            + original.people.length
            + " . Output length: " + algoed.people.length + "\n");
    } 
    if (algoed.tasks.length > 0) {
        console.log("Length of task list is not 0. \n");
    } 
    const originalWorkload = original.getTotalWorkload();
    const algoedWorkload = algoed.getTotalWorkload();
    if ( originalWorkload != algoedWorkload) {
        console.log("Total workload different: Original total: " 
        + originalWorkload
        + ". Output total: " + algoedWorkload + "\n");
    }

    console.log("Checking for distribution... \n");
    
    console.log("People and their workloads: \n");
    const list = algoed.people.map(person => algoed.getWorkloadOf(person));
    const cv = math.std(list) / (algoedWorkload / original.people.length);
    if (verbose) {
        for (const person of algoed.people) {
            console.log(person.name + ": " + algoed.getWorkloadOf(person) + " hrs \n");
        }
    }
    console.log("Coefficient of Variance for workload: "+ cv + "\n");

    const incompats = algoed.people.map(person => {
        let out = 0;
        for (const task of person.tasks) {
            if (!person.canTakeTask(task)) {
                out += 1;
            }
        }
        return out;
    })
    if (verbose) {
        console.log("People and their less preferred timeslots");
        for (let i = 0; i < algoed.people.length; i++) {
            console.log(algoed.people[i].name + ": " + incompats[i] + " tasks \n");
        }
    }
    const totalIncompats = incompats.reduce(function (a, b) {return a + b;}, 0);
    const cv2 = math.std(incompats) / (totalIncompats / original.people.length);
    console.log("Coefficient of Variance for incompatible tasks: " + cv2 + "\n");
}

module.exports = test;