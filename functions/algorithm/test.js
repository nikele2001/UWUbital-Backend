// additional imports
const { Availability } = require("./../algorithm/Availability");
const AvailJSON = require("./../algorithm/AvailabilityJSONable");
const { DateTime, Interval } = require("luxon");

const s = DateTime.fromISO("2021-12-27T09:57:16.184Z");
const e = DateTime.fromISO("2021-12-27T09:57:16.184Z");
const a = new Availability(3, Interval.fromDateTimes(s, e));
const availJSONstring = JSON.stringify(a.toJSONable());

// console.log(a);
// console.log(JSON.parse(availJSONstring));
// console.log(Availability.fromJSONable(a));

// to convert datetime object into number: object.valueOf(), where object is of type dateTime
const datestring = s.valueOf();
// convert integer to date object
const JSdate = new Date(datestring);
const luxonDateTime = DateTime.fromJSDate(JSdate);
//console.log(luxonDateTime);

// to convert availability obj to json string
const availabilityJSONstring = JSON.stringify(a.toJSONable());

// to convert json string to availability obj
// const availobject = Availability.fromJSONable(
//   JSON.parse(availabilityJSONstring)
// );

let arr = [];
for (let i = 0; i < 4; i++) {
  arr[i] = i;
}
console.log(arr);
