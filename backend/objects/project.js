const {Person} = require('./person');
const {TaskGroup} = require('./taskGroup');
const {ProjectJSONable} = require('./projectJSONable');

class Project {
    // id is a number
    // name is a string
    // people is an array of Person objects
    // taskGroups is an array of TaskGroup objects
    constructor(id, name, people, taskGroups) {
      this.id = id;
      this.name = name;
      this.people = people;
      this.taskGroups = taskGroups;
    }
    toString() {
      return (
        "Project " +
        this.name +
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
      return new ProjectJSONable(this.id, this.name, peopleCopy, taskCopy);
    }
    static fromJSONable(proj) {
      const peopleCopy = [];
      const taskCopy = [];
      for (let i = 0; i < proj.people.length; i++) {
        peopleCopy[i] = Person.fromJSONable(proj.people[i]);
      }
      for (let i = 0; i < proj.taskGroups.length; i++) {
        taskCopy[i] = TaskGroup.fromJSONable(proj.tasks[i]);
      }
      return new Project(this.id, this.name, peopleCopy, taskCopy);
    }
}

module.exports = {Project};