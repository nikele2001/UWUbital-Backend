// const db = require("../util/database");

const { Availability } = require("./Availability");
const { PersonJSONable } = require("./personJSONable");
const { AvailabilityJSONable } = require("./AvailabilityJSONable");

class Person {
  // id is a string
  // name is a string
  // avail is an array of Availability objects
  // role is a string (editor/viewer)
  constructor(personId, name, availabilities, role) {
    this.personId = personId;
    this.name = name;
    this.availabilities = availabilities;
    this.role = role;
  }
  getId() {
    return this.personId;
  }
  toString() {
    var out = "Name: " + this.name + ", " + this.role + "\n";
    out += "Availabilities: ";
    for (var avail of this.availabilities) {
      out += avail.toString() + "\n";
    }
    return out;
  }
  toJSONable() {
    const outAvails = [];
    for (let i = 0; i < this.availabilities.length; i++) {
      outAvails[i] = this.availabilities[i].toJSONable();
    }
    return new PersonJSONable(this.personId, this.name, outAvails, this.role);
  }

  static fromJSONable(object) {
    const outAvails = [];
    for (let i = 0; i < object.availabilities.length; i++) {
      outAvails[i] = Availability.fromJSONable(object.availabilities[i]);
    }
    return new Person(object.id, object.name, outAvails, object.role);
  }
  createCopy() {
    const outAvails = [];
    for (let i = 0; i < this.availabilities.length; i++) {
      outAvails[i] = this.availabilities[i].createCopy();
    }
    return new Person(this.personId, this.name, outAvails, this.role);
  }
  canTakeTask(task, project) {
    let out = true;
    for (const avail of this.availabilities) {
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
