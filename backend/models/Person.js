const task = require("./Task");
const personJSONable = require("./PersonJSONable");
const luxon = require("luxon");

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
    return new personJSONable.PersonJSONable(
      this.id,
      this.name,
      outAvails,
      this.role
    );
  }
}

module.exports = { Person };
