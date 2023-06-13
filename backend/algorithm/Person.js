// const db = require("../util/database");

const { Availability } = require("./Availability");
const { PersonJSONable } = require("./personJSONable");

class Person {
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
  getId() {
    return this.id;
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

  static fromJSONable(object) {
    const outAvails = [];
    for (let i = 0; i < object.avails.length; i++) {
      outAvails[i] = Availability.fromJSONable(object.avails[i]);
    }
    return new Person(object.id, object.name, outAvails, role);
  }
  createCopy() {
    const outAvails = [];
    for (let i = 0; i < this.avails.length; i++) {
      outAvails[i] = this.avails[i].createCopy();
    }
    return new Person(this.id, this.name, outAvails, this.role);
  }
  canTakeTask(task, project) {
    let out = true;
    for (const avail of this.avails) {
      out = !avail.overlaps(task.getInterval()) && out;
    }
    for (const tg of project.taskGroups) {
      for (const other of tg.tasks) {
        out = out && (other === task || !other.overlaps(task));
      }
    }
    return out;
  }
}

module.exports = { Person };
