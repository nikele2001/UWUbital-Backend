import {Person, Task, Project} from 'Objects';
import {PriorityQueue} from 'js-priority-queue';

export default function runGreedyAlgorithm(project) {
    /*
    WARNING: this function mutates the project passed in as argument.

    Algorithm
    1. Get a list of pairs containing a task and the number of people it can be assigned to.
    2. Sort the list by increasing possible assignees.
    3. Create a min priority queue of people by the amount of hours already assigned.
    4. From 2, start assigning tasks in that order to the people in the priority queue and update 
        their priority by the length of that task. If a person's would-be workload exceeds 120% 
        of (total workload / number of people), consider the person unavailable. 
        If a person workload exceeds 100% of (total workload / number of people), do not add back to the queue. 
        If a task cannot be assigned because the person is not available, assign it to the next available 
        person instead. If a task cannot be assigned to anybody, add it to a "dumpster" list.
    5. After all tasks are assigned from the regular list, sort the "dumpster" list by 
        decreasing length and use it to assign tasks like in 4, except disregard if the person 
        is available or not.
    */
    let people = project.people;
    let tasks = project.tasks;

    // define constants
    const totalWorkload = Person.getTotalWorkload(people) + Task.getTotalWorkload(tasks);
    const meanWorkload = totalWorkload / people.length;
    const upperLimit = meanWorkload * 1.2;

    // step 1
    const taskQueue = [];
    for (const task of taskQueue) {
        let canDo = 0;
        for (const person of people) {
            if (person.canTakeTask(task)) {
                canDo++;
            }
        }
        taskQueue.push({"task": task, "assignees": canDo});
    }

    // step 2
    taskQueue.sort((a, b) => a.assignees <= b.assignees ? -1 : 1);

    // step 3
    const pArray = people.map(person => {
        return {"person": person, "workload": person.getTotalWorkload(), newTasks: []};
    });
    const pQueue = new PriorityQueue({comparator: function (a, b) {
        return b.workload - a.workload;
    }});
    for (const p in pArray) {
        pQueue.queue(p);
    }

    // step 4
    const dumpsterList = [];
    for (const t of taskQueue) {
        const task = t.task;
        const unavailableP = [];
        let unassigned = true;
        while (unassigned && pQueue.length > 0) {
            const lowest = pQueue.dequeue();
            if (lowest.person.canTakeTask(task) 
                && lowest.workload <= meanWorkload
                && lowest.workload + task.getTimeNeeded() <= upperLimit) {
                lowest.newTasks.push(task);
                unassigned = false;
                lowest.workload += task.getTimeNeeded();
                pQueue.queue(lowest);
            } else {
                unavailableP.push(lowest);
            }
        }
        if (unassigned) {
            dumpsterList.push(task);
        }
        for (const p in unavailableP) {
            pQueue.queue(p);
        }
    }

    // step 5
    dumpsterList.sort((a, b) => a.getTimeNeeded() - b.getTimeNeeded());
    for (const task of dumpsterList) {
        const lowest = pQueue.dequeue();
        lowest.newTasks.push(task);
        lowest.workload += task.getTimeNeeded();
        pQueue.queue(lowest);
    }

    // reassign tasks and return
    const out = new Project([], []);
    out.people = pArray.map(p => {
        p.person.tasks = [...p.person.tasks, ...p.newTasks];
        return p.person;
    })
    return out;
}