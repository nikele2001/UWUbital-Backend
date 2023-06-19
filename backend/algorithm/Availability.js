const { DateTime, Interval } = require("luxon");
const { AvailabilityJSONable } = require("./AvailabilityJSONable");

class Availability {
  // id is a number
  // interval is an Interval object from the Luxon library
  constructor(availabilityId, interval) {
    this.availabilityId = availabilityId;
    this.interval = interval;
  }

  toString() {
    return this.interval.toLocaleString(DateTime.DATETIME_MED);
  }

  toJSONable() {
    return new AvailabilityJSONable(
      this.availabilityId,
      this.interval.toISO({ suppressSeconds: true })
    );
  }
  static fromJSONable(object) {
    return new Availability(
      this.availabilityId,
      Interval.fromISO(object.interval)
    );
  }
  createCopy() {
    return new Availability(this.availabilityId, this.interval);
  }
  overlaps(interval) {
    return this.interval.overlaps(interval);
  }
}

module.exports = { Availability };
