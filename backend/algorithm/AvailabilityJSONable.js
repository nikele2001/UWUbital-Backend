class AvailabilityJSONable {
  // availabilityId is a number
  // interval is an ISO string
  constructor(availabilityId, interval) {
    this.availabilityId = availabilityId;
    this.interval = interval;
  }
  toString() {
    return this.interval;
  }
}

module.exports = { AvailabilityJSONable };
