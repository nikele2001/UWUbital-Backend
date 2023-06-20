class PersonJSONable {
  // id is a number
  // name is a string
  // avail is an array of AvailabilityJSONable objects
  // role is a string(viewer/ editor)
  constructor(personId, name, availabilities, role) {
    this.personId = personId;
    this.name = name;
    this.availabilities = availabilities;
    this.role = role;
  }

  toString() {
    var out = "JSON Name: " + this.name + ", " + this.role + "\n";
    out += "Availabilities: ";
    for (var avail of this.availabilities) {
      out += avail.toString() + "\n";
    }
    return out;
  }
}

module.exports = { PersonJSONable };
