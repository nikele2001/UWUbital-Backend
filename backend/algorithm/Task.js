
const {DateTime} = require('luxon');
const {TaskJSONable} = require('./TaskJSONable');


class Task {
  // task_id is a number
  // interval is a Luxon Interval
  // user_id is a number
  // completed is a boolean
  // proj_id is a number
  // task_priority is a number
  // group_id is a number
  // isAssigned is a boolean
  constructor(
    task_id,
    interval,
    user_id,
    isCompleted,
    proj_id,
    task_priority,
    group_id,
    isAssigned
  ) {
    this.task_id = task_id;
    this.interval = interval;
    this.user_id = user_id;
    this.isCompleted = isCompleted;
    this.proj_id = proj_id;
    this.task_priority = task_priority;
    this.group_id = group_id;
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
    var out = "Task: " + this.name + "\n";
    out += "Interval: " + this.getInterval() + "\n";
    out += "Time needed: " + this.getTimeNeeded() + "\n";
    return out;
  }
  toJSONable() {
    const outInterval = this.interval.toISO({ suppressSeconds: true });
    return new TaskJSONable(
      this.task_id,
      outInterval,
      this.user_id,
      this.completed,
      this.proj_id,
      this.task_priority,
      this.group_id,
      this.isAssigned
    );
  }
  static fromJSONable(object) {
    const outInterval = Interval.fromISO(object.interval);
    return new Task(
      this.task_id,
      outInterval,
      this.user_id,
      this.completed,
      this.proj_id,
      this.task_priority,
      this.group_id,
      this.isAssigned
    );
  }
  createCopy() {
    return new Task(
      this.task_id,
      this.interval,
      this.user_id,
      this.completed,
      this.proj_id,
      this.task_priority,
      this.group_id,
      this.isAssigned
    );
  }
  overlaps(other) {
    return this.interval.overlaps(other.interval);
  }
  isAssignedTo(person) {
    return this.user_id === person.getId();
  }
  assignTo(person) {
    this.user_id = person.getId();
  }
  setUnassigned() {
    this.isAssigned = false;
  }
}

module.exports = { Task };
