const luxon = require("luxon");
const availability = require("./Availability");

class AvailabilityJSONable {
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
    return new availability.Availability(
      this.id,
      luxon.Interval.fromISO(object.interval)
    );
  }
}

module.exports = { AvailabilityJSONable };
