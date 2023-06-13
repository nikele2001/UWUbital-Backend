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
}
 
module.exports = {AvailabilityJSONable};