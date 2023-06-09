const {DateTime} = require('luxon');
const {TaskJSONable} = require('./taskJSONable');

class Task {
    // task_id is a number
    // interval is a Luxon Interval
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
    getInterval() {
      return this.interval.toLocaleString(DateTime.DATETIME_MED);
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
        this.group_id
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
          this.group_id
        );
      }
}

module.exports = {Task};