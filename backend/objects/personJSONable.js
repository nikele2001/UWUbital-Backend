class PersonJSONable {
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
}

module.exports = {PersonJSONable};