class TaskJSONable {
  // task_id is a number
  // interval is an ISO string
  // user_id is a number
  // isCompleted is a boolean
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
  toString() {
    var out = "JSON Task:\n";
    out += "Interval: " + this.interval + "\n";
    return out;
  }
}

module.exports = { TaskJSONable };
