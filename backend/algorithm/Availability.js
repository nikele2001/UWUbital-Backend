const { DateTime } = require("luxon");
const { AvailabilityJSONable } = require("./availabilityJSONable");

class Availability {
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
      this.id,
      this.interval.toISO({ suppressSeconds: true })
    );
  }
  static fromJSONable(object) {
    return new Availability(this.id, Interval.fromISO(object.interval));
  }
  createCopy() {
    return new Availability(this.id, this.interval);
  }
  overlaps(interval) {
    return this.interval.overlaps(interval);
  }
}

module.exports = { Availability };
