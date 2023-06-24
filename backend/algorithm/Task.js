const { DateTime, Interval } = require("luxon");
const { TaskJSONable } = require("./TaskJSONable");

class Task {
  // taskId is a number
  // interval is a Luxon Interval
  // personId is a number
  // completed is a boolean
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
  getIntervalString() {
    return this.interval.toLocaleString(DateTime.DATETIME_MED);
  }
  getInterval() {
    return this.interval;
  }
  getTimeNeeded() {
    return Math.round(this.interval.toDuration("minutes").toObject().minutes);
  }
  toString() {
    var out = "Task: \n";
    out += "Interval: " + this.getIntervalString() + "\n";
    out += "Time needed: " + this.getTimeNeeded() + "\n";
    out += "Assigned to: " + this.personId + "\n";
    return out;
  }
  toJSONable() {
    const outInterval = this.interval.toISO({ suppressSeconds: true });
    return new TaskJSONable(
      this.taskId,
      outInterval,
      this.personId,
      this.completed,
      this.projectId,
      this.taskPriority,
      this.taskGroupId,
      this.isAssigned
    );
  }
  static fromJSONable(object) {
    const outInterval = Interval.fromISO(object.interval);
    return new Task(
      object.taskId,
      outInterval,
      object.personId,
      object.completed,
      object.projectId,
      object.taskPriority,
      object.taskGroupId,
      object.isAssigned
    );
  }
  createCopy() {
    return new Task(
      this.taskId,
      this.interval,
      this.personId,
      this.completed,
      this.projectId,
      this.taskPriority,
      this.taskGroupId,
      this.isAssigned
    );
  }
  overlaps(other) {
    return this.interval.overlaps(other.interval);
  }
  isAssignedTo(person) {
    return this.personId === person.getId();
  }
  assignTo(person) {
    this.personId = person.getId();
  }
  setUnassigned() {
    this.isAssigned = false;
  }
}

module.exports = { Task };
