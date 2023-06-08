const luxon = require("luxon");
const person = require("./Person");
const task = require("./Task");
const projectJSONable = require("./ProjectJSONable");

class Project {
  // id is a number
  // name is a string
  // people is an array of Person objects
  // tasks is an array of Task objects
  constructor(id, name, people, tasks) {
    this.id = id;
    this.name = name;
    this.people = people;
    this.tasks = tasks;
  }
  toString() {
    return (
      "Project " +
      this.name +
      "\nPeople: " +
      this.people +
      "\n Tasks: " +
      this.tasks +
      "\n"
    );
  }

  toJSONable() {
    const peopleCopy = [];
    const taskCopy = [];
    for (let i = 0; i < this.people.length; i++) {
      peopleCopy[i] = this.people[i].toJSONable();
    }
    for (let i = 0; i < this.tasks.length; i++) {
      taskCopy[i] = this.tasks[i].toJSONable();
    }
    return new projectJSONable.ProjectJSONable(
      this.id,
      this.name,
      peopleCopy,
      taskCopy
    );
  }
}

module.exports = { Project };
