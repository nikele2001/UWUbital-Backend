class TaskJSONable {
    // task_id is a number
    // interval is an ISO string 
    // user_id is a number
    // completed is a boolean
    // proj_id is a number
    // task_priority is a number
    // group_id is a number
    constructor(
      task_id,
      interval,
      user_id,
      completed,
      proj_id,
      task_priority,
      group_id
    ) {
      this.task_id = task_id;
      this.interval = interval;
      this.user_id = user_id;
      this.completed = completed;
      this.proj_id = proj_id;
      this.task_priority = task_priority;
      this.group_id = group_id;
    }
    toString() {
      var out = "JSON Task: " + this.name + "\n";
      out += "Interval: " + this.interval + "\n";
      return out;
    }
}

module.exports = {TaskJSONable};