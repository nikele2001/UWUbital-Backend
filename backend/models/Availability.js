const luxon = require("luxon");
const availabilityJSONable = require("./AvailabilityJSONable");

class Availability {
  // id is a number
  // interval is an Interval object from the Luxon library
  constructor(id, interval) {
    this.id = id;
    this.interval = interval;
  }

  toString() {
    return this.interval.toLocaleString(luxon.DateTime.DATETIME_MED);
  }

  toJSONable() {
    return new availabilityJSONable.AvailabilityJSONable(
      id,
      this.interval.toISO({ suppressSeconds: true })
    );
  }
}

module.exports = { Availability };
