const { Task } = require("./Task");
const { TaskGroupJSONable } = require("./TaskGroupJSONable");

class TaskGroup {
  // id is number
  // name is string
  // tasks is a Task array
  // pax is a number
  // priority is a number
  constructor(id, name, tasks, pax) {
    this.id = id;
    this.name = name;
    this.tasks = tasks;
    this.pax = pax;
    // this.priority = priority;
  }
  toString() {
    let out = "Task Group " + this.name + ":\n";
    for (const task of this.tasks) {
      out += task.toString();
    }
    return out;
  }
  toJSONable() {
    const outTasks = [];
    for (let i = 0; i < this.tasks.length; i++) {
      outTasks[i] = this.tasks[i].toJSONable();
    }
    return new TaskGroupJSONable(
      this.id,
      this.name,
      outTasks,
      this.pax
      // this.priority
    );
  }
  static fromJSONable(object) {
    const outTasks = [];
    for (let i = 0; i < object.tasks.length; i++) {
      outTasks[i] = Task.fromJSONable(object.tasks[i]);
    }
    return new TaskGroup(this.id, this.name, outTasks, this.pax);
  }
  getTotalWorkload() {
    let out = 0;
    for (const task of this.tasks) {
      out += task.getTimeNeeded();
    }
    return out;
  }
  createCopy() {
    const outTasks = [];
    for (let i = 0; i < this.tasks.length; i++) {
      outTasks[i] = this.tasks[i].createCopy();
    }
    return new TaskGroup(this.id, this.name, outTasks, this.pax, this.priority);
  }
  getWorkloadOf(person) {
    let out = 0;
    for (const task of this.tasks) {
      if (task.isAssignedTo(person)) {
        out += task.getTimeNeeded();
      }
    }
    return out;
  }
}

module.exports = { TaskGroup };
