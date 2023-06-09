const {AvailabilityJSONable} = require('./availabilityJSONable');
const {PersonJSONable} = require('./personJSONable');

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
      return new PersonJSONable(this.id, this.name, outAvails, this.role);
    }
    static fromJSONable(object) {
        const outAvails = [];
        for (let i = 0; i < object.avails.length; i++) {
          outAvails[i] = AvailabilityJSONable.fromJSONable(object.avails[i]);
        }
        return new Person(object.id, object.name, outAvails, role);
    }
}

module.exports = {Person};