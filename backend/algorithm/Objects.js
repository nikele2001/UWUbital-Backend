import { DateTime, Interval } from "luxon";

export class Project {
  // id is a number
  // name is a string
  // people is an array of Person objects
  // tasks is an array of Task objects
  constructor(id, name, people, tasks) {
    this.id = id;
    this.name = name;
    this.people = people;
    this.tasks = tasks;
  }
  toString() {
    return (
      "Project " +
      this.name +
      "\nPeople: " +
      this.people +
      "\n Tasks: " +
      this.tasks +
      "\n"
    );
  }

  toJSONable() {
    const peopleCopy = [];
    const taskCopy = [];
    for (let i = 0; i < this.people.length; i++) {
      peopleCopy[i] = this.people[i].toJSONable();
    }
    for (let i = 0; i < this.tasks.length; i++) {
      taskCopy[i] = this.tasks[i].toJSONable();
    }
    return new ProjectJSONable(this.id, this.name, peopleCopy, taskCopy);
  }
}

export class ProjectJSONable {
  // id is a number
  // name is a string
  // people is an array of PersonJSONable objects
  // tasks is an array of TaskJSONable objects
  constructor(id, name, people, tasks) {
    this.id = id;
    this.name = name;
    this.people = people;
    this.tasks = tasks;
  }

  toString() {
    return (
      "ProjectJSONable " +
      this.name +
      "\nPeople: " +
      this.people +
      "\n Tasks: " +
      this.tasks +
      "\n"
    );
  }

  static fromJSONable(proj) {
    const peopleCopy = [];
    const taskCopy = [];
    for (let i = 0; i < proj.people.length; i++) {
      peopleCopy[i] = PersonJSONable.fromJSONable(proj.people[i]);
    }
    for (let i = 0; i < proj.tasks.length; i++) {
      taskCopy[i] = TaskJSONable.fromJSONable(proj.tasks[i]);
    }
    return new Project(this.id, this.name, peopleCopy, taskCopy);
  }
}

export class Person {
  // id is a string
  // name is a string
  // avail is an array of Availability objects
  // role is a string (editor/viewer)
  constructor(id, name, avails, role) {
    this.id = id;
    this.name = name;
    this.avails = avails;
    this.role = role;
  }

  toString() {
    var out = "Name: " + this.name + ", " + this.role + "\n";
    out += "Availabilities: ";
    for (var avail of this.avails) {
      out += avail.toString() + "\n";
    }
    return out;
  }

  toJSONable() {
    const outAvails = [];
    for (let i = 0; i < this.avails.length; i++) {
      outAvails[i] = this.avails[i].toJSONable();
    }
    return new PersonJSONable(this.id, this.name, outAvails, this.role);
  }
}

export class PersonJSONable {
  // id is a number
  // name is a string
  // avail is an array of AvailabilityJSONable objects
  // role is a string(viewer/ editor)
  constructor(id, name, avails, role) {
    this.id = id;
    this.name = name;
    this.avails = avails;
    this.role = role;
  }

  toString() {
    var out = "JSON Name: " + this.name + ", " + this.role + "\n";
    out += "Availabilities: ";
    for (var avail of this.avails) {
      out += avail.toString() + "\n";
    }
    return out;
  }

  static fromJSONable(object) {
    const outAvails = [];
    for (let i = 0; i < object.avails.length; i++) {
      outAvails[i] = AvailabilityJSONable.fromJSONable(object.avails[i]);
    }
    return new Person(object.id, object.name, outAvails, role);
  }
}

export class Task {
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
}

export class TaskJSONable {
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

export class Availability {
  // id is a number
  // interval is an Interval object from the Luxon library
  constructor(id, interval) {
    this.id = id;
    this.interval = interval;
  }

  toString() {
    return this.interval.toLocaleString(DateTime.DATETIME_MED);
  }

  toJSONable() {
    return new AvailabilityJSONable(
      id,
      this.interval.toISO({ suppressSeconds: true })
    );
  }
}

export class AvailabilityJSONable {
  // id is a number
  // interval is an ISO string
  constructor(id, interval) {
    this.id = id;
    this.interval = interval;
  }
  toString() {
    return this.interval;
  }
  static fromJSONable(object) {
    return new Availability(this.id, Interval.fromISO(object.interval));
  }
}
