class TaskJSONable {
    // id is a number
    // name is a String
    // pax is an number
    // interval is an ISO string
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
    toString() {
      var out = "JSON Task: " + this.name + "\n";
      out += "People required: " + this.pax + "\n";
      out += "Interval: " + this.interval + "\n";
      return out;
    }
}

module.exports = {TaskJSONable};