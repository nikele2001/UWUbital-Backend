const {DateTime} = require('luxon');
const {TaskJSONable} = require('./taskJSONable');

class Task {
    // id is a number
    // name is a String
    // pax is an number
    // interval is an Interval object from the Luxon library
    // user_id is a number
    // completed is a boolean
    // proj_id is a number
    // priority is a number
    constructor(
      id,
      name,
      pax,
      interval,
      user_id,
      completed,
      proj_id,
      priority,
      group_id
    ) {
      this.id = id;
      this.name = name;
      this.pax = pax;
      this.interval = interval;
      this.user_id = user_id;
      this.completed = completed;
      this.proj_id = proj_id;
      this.priority = priority;
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
      out += "People required: " + this.pax + "\n";
      out += "Interval: " + this.getInterval() + "\n";
      out += "Time needed: " + this.getTimeNeeded() + "\n";
      return out;
    }
    toJSONable() {
      const outInterval = this.interval.toISO({ suppressSeconds: true });
      return new TaskJSONable(
        this.id,
        this.name,
        this.pax,
        outInterval,
        this.user_id,
        this.completed,
        this.proj_id,
        this.priority,
        this.group_id
      );
    }
    static fromJSONable(object) {
        const outInterval = Interval.fromISO(object.interval);
        return new Task(
          this.id,
          this.name,
          this.pax,
          outInterval,
          this.user_id,
          this.completed,
          this.proj_id,
          this.priority,
          this.group_id
        );
      }
}

module.exports = {Task};