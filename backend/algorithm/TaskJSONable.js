class TaskJSONable {
  // taskId is a number
  // interval is an ISO string
  // personId is a number
  // isCompleted is a boolean
  // projectId is a number
  // taskPriority is a number
  // taskGroupId is a number
  // isAssigned is a boolean
  constructor(
    taskId,
    interval,
    personId,
    isCompleted,
    projectId,
    taskPriority,
    taskGroupId,
    isAssigned
  ) {
    this.taskId = taskId;
    this.interval = interval;
    this.personId = personId;
    this.isCompleted = isCompleted;
    this.projectId = projectId;
    this.taskPriority = taskPriority;
    this.taskGroupId = taskGroupId;
    this.isAssigned = isAssigned;
  }
  toString() {
    var out = "JSON Task:\n";
    out += "Interval: " + this.interval + "\n";
    return out;
  }
}

module.exports = { TaskJSONable };
