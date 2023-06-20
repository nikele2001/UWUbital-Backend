const { Person } = require("./Person");
const { TaskGroup } = require("./TaskGroup");
const { ProjectJSONable } = require("./ProjectJSONable");

class Project {
  // projectId is a number
  // projectName is a string
  // people is an array of Person objects
  // taskGroups is an array of TaskGroup objects
  constructor(projectId, projectName, people, taskGroups) {
    this.projectId = projectId;
    this.projectName = projectName;
    this.people = people;
    this.taskGroups = taskGroups;
  }
  toString() {
    return (
      "Project " +
      this.projectName +
      "\nPeople: " +
      this.people +
      "\n Tasks: " +
      this.taskGroups +
      "\n"
    );
  }

  toJSONable() {
    const peopleCopy = [];
    const taskCopy = [];
    for (let i = 0; i < this.people.length; i++) {
      peopleCopy[i] = this.people[i].toJSONable();
    }
    for (let i = 0; i < this.taskGroups.length; i++) {
      taskCopy[i] = this.taskGroups[i].toJSONable();
    }
    return new ProjectJSONable(
      this.projectId,
      this.projectName,
      peopleCopy,
      taskCopy
    );
  }
  static fromJSONable(proj) {
    const peopleCopy = [];
    const taskCopy = [];
    for (let i = 0; i < proj.people.length; i++) {
      peopleCopy[i] = Person.fromJSONable(proj.people[i]);
    }
    for (let i = 0; i < proj.taskGroups.length; i++) {
      taskCopy[i] = TaskGroup.fromJSONable(proj.taskGroups[i]);
    }
    return new Project(proj.projectId, proj.projectName, peopleCopy, taskCopy);
  }
  getTotalWorkload() {
    let out = 0;
    for (const tg of this.taskGroups) {
      out += tg.getTotalWorkload();
    }
    return out;
  }
  getWorkloadOf(person) {
    let out = 0;
    for (const tg of this.taskGroups) {
      out += tg.getWorkloadOf(person);
    }
    return out;
  }
  createCopy() {
    const peopleCopy = [];
    const taskCopy = [];
    for (let i = 0; i < this.people.length; i++) {
      peopleCopy[i] = this.people[i].createCopy();
    }
    for (let i = 0; i < this.taskGroups.length; i++) {
      taskCopy[i] = this.taskGroups[i].createCopy();
    }
    return new Project(this.projectId, this.projectName, peopleCopy, taskCopy);
  }
}

module.exports = { Project };
