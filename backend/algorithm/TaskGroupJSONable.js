class TaskGroupJSONable {
  // taskGroupId is number
  // taskGroupName is string
  // tasks is a TaskJSONable array
  // pax is a number
  // priority is a number
  constructor(taskGroupId, taskGroupName, tasks, pax) {
    this.taskGroupId = taskGroupId;
    this.taskGroupName = taskGroupName;
    this.tasks = tasks;
    this.pax = pax;
    // this.priority = priority;
  }
  toString() {
    let out = "Task Group JSON " + this.taskGroupName + ":\n";
    for (const task of this.tasks) {
      out += task.toString();
    }
    return out;
  }
}

module.exports = { TaskGroupJSONable };
