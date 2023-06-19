// const { PriorityQueue } = require("js-priority-queue");
const {
  PriorityQueue,
  MinPriorityQueue,
  MaxPriorityQueue,
} = require("@datastructures-js/priority-queue");
const { Project } = require("./../algorithm/Project");
module.exports = {
  runGreedyAlgorithm: function (project, numOfPriority) {
    /*
    Param: A Project object with some unassigned tasks (tasks in taskGroups with user_id of undefined or -1).
    Return: A Project object with no unassigned tasks.

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

    const proj = project.createCopy();
    const people = proj.people;

    // get list of tasks and divide by priority
    const allTasks = [];
    for (let i = 0; i < numOfPriority; i++) {
      allTasks[i] = [];
    }
    for (const tg of proj.taskGroups) {
      for (const task of tg.tasks) {
        allTasks[task.task_priority].push(task);
      }
    }
    // define constants
    const totalWorkload = proj.getTotalWorkload();
    const meanWorkload = totalWorkload / people.length;
    const upperLimit = meanWorkload * 1.2;

    for (const tasks of allTasks) {
      const taskQueue = [];
      // step 1
      for (const task of tasks) {
        let canDo = 0;
        for (const person of people) {
          if (person.canTakeTask(task, project)) {
            canDo++;
          }
        }
        taskQueue.push({ task: task, assignees: canDo });
      }
      // step 2
      taskQueue.sort((a, b) => (a.assignees <= b.assignees ? -1 : 1));

      // step 3
      const pArray = people.map((person) => {
        return {
          person: person,
          workload: proj.getWorkloadOf(person),
        };
      });
      const comparator = (a, b) => {
        if (b.workload > a.workload) {
          return -1;
        }
        return 1;
      };
      const pQueue = new PriorityQueue(comparator);
      for (let i = 0; i < pArray.length; i++) {
        pQueue.enqueue(pArray[i]);
      }
      // step 4
      const dumpsterList = [];
      for (const t of taskQueue) {
        const task = t.task;
        const unavailableP = [];
        let unassigned = true;
        while (unassigned && pQueue.length > 0) {
          const lowest = pQueue.dequeue();
          if (
            lowest.person.canTakeTask(task) &&
            lowest.workload <= meanWorkload &&
            lowest.workload + task.getTimeNeeded() <= upperLimit
          ) {
            task.assignTo(lowest.person);
            task.setUnassigned();
            unassigned = false;
            lowest.workload += task.getTimeNeeded();
            pQueue.enqueue(lowest);
          } else {
            unavailableP.push(lowest);
          }
        }
        if (unassigned) {
          dumpsterList.push(task);
        }
        for (const p in unavailableP) {
          pQueue.enqueue(p);
        }
      }
      // step 5
      dumpsterList.sort((a, b) => a.getTimeNeeded() - b.getTimeNeeded());
      for (const task of dumpsterList) {
        const lowest = pQueue.dequeue();
        task.assignTo(lowest.person);
        task.setUnassigned();
        lowest.workload += task.getTimeNeeded();
        pQueue.enqueue(lowest);
      }
    }
    return proj;
  },
};

// local test case
let projJSONable = {
  id: 8,
  name: "project by nicbot",
  people: [
    {
      id: 2,
      name: "nikele",
      avails: [],
      role: "viewer",
    },
    {
      id: 3,
      name: "nikele2",
      avails: [],
      role: "viewer",
    },
    {
      id: 4,
      name: "nicbot",
      avails: [],
      role: "owner",
    },
  ],
  taskGroups: [
    {
      id: 18,
      name: "nicbot tasks for 3",
      tasks: [
        {
          task_id: 80,
          interval:
            "2023-06-17T00:30:38.835+08:00/2023-06-17T01:30:38.835+08:00",
          user_id: null,
          isCompleted: false,
          proj_id: "8",
          task_priority: 0,
          group_id: 18,
          isAssigned: true,
        },
        {
          task_id: 81,
          interval:
            "2023-06-17T00:30:38.835+08:00/2023-06-17T01:30:38.835+08:00",
          user_id: null,
          isCompleted: false,
          proj_id: "8",
          task_priority: 0,
          group_id: 18,
          isAssigned: true,
        },
        {
          task_id: 82,
          interval:
            "2023-06-17T00:30:38.835+08:00/2023-06-17T01:30:38.835+08:00",
          user_id: null,
          isCompleted: false,
          proj_id: "8",
          task_priority: 0,
          group_id: 18,
          isAssigned: true,
        },
      ],
      pax: 3,
    },
    // {
    //   id: 21,
    //   name: "nicbot tasks for 4",
    //   tasks: [
    //     {
    //       task_id: 99,
    //       interval:
    //         "2023-06-17T00:57:51.635+08:00/2023-06-17T01:57:51.635+08:00",
    //       user_id: "2",
    //       isCompleted: false,
    //       proj_id: "8",
    //       task_priority: 0,
    //       group_id: 21,
    //       isAssigned: true,
    //     },
    //     {
    //       task_id: 100,
    //       interval:
    //         "2023-06-17T00:57:51.635+08:00/2023-06-17T01:57:51.635+08:00",
    //       user_id: "3",
    //       isCompleted: false,
    //       proj_id: "8",
    //       task_priority: 0,
    //       group_id: 21,
    //       isAssigned: true,
    //     },
    //     {
    //       task_id: 101,
    //       interval:
    //         "2023-06-17T00:57:51.635+08:00/2023-06-17T01:57:51.635+08:00",
    //       user_id: "4",
    //       isCompleted: false,
    //       proj_id: "8",
    //       task_priority: 0,
    //       group_id: 21,
    //       isAssigned: true,
    //     },
    //     {
    //       task_id: 102,
    //       interval:
    //         "2023-06-17T00:57:51.635+08:00/2023-06-17T01:57:51.635+08:00",
    //       user_id: null,
    //       isCompleted: false,
    //       proj_id: "8",
    //       task_priority: 0,
    //       group_id: 21,
    //       isAssigned: false,
    //     },
    //   ],
    //   pax: 4,
    // },
  ],
};

const project = Project.fromJSONable(projJSONable);
// console.log(project);
const priority = 3;
module.exports.runGreedyAlgorithm(project, priority);
const result = module.exports.runGreedyAlgorithm(project, priority).toString();
console.log(result)