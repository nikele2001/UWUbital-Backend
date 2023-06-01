import { ProjectJSONable, Project, Person, Task } from "./Objects";
import math from 'mathjs';

// function to run on a project to test if it works, and how efficient it is.
export default function test(projJSON, algo) {
    const original = ProjectJSONable.fromJSONable(projJSON);
    const algoed = algo(ProjectJSONable.fromJSONable(projJSON));

    console.log("Checking for validity... \n");
    if (original.people.length !== algoed.people.length) {
        console.log("Length of people list different: Original length: " 
            + original.people.length
            + " . Output length: " + algoed.people.length + "\n");
    } 
    if (algoed.task.length > 0) {
        console.log("Length of output task list is not 0. \n");
    } 
    const originalWorkload = Person.getTotalWorkload(original.people) + Task.getTotalWorkload(original.tasks);
    const algoedWorkload = Person.getTotalWorkload(algoed.people) + Task.getTotalWorkload(algoed.tasks);
    if ( originalWorkload != algoedWorkload) {
        console.log("Total workload different: Original total: " 
        + originalWorkload
        + " . Output total: " + algoedWorkload + "\n");
    }

    console.log("Checking for distribution... \n");
    
    const list = algoed.people.map(person => person.getTotalWorkload());
    const cv = math.std(list) / (algoedWorkload / original.people.length);
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
    const totalIncompats = incompats.reduce(function (a, b) {return a + b;}, 0);
    const cv2 = math.std(incompats) / (totalIncompats / original.people.length);
    console.log("Coefficient of Variance for incompatible tasks: " + cv2 + "\n");
}