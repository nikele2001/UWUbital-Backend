const {PersonJSONable} = require('./personJSONable');
const {TaskJSONable} = require('./taskJSONable');
const {ProjectJSONable} = require('./projectJSONable');

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
      return new ProjectJSONable(this.id, this.name, peopleCopy, taskCopy);
    }
    static fromJSONable(proj) {
      const peopleCopy = [];
      const taskCopy = [];
      for (let i = 0; i < proj.people.length; i++) {
        peopleCopy[i] = PersonJSONable.fromJSONable(proj.people[i]);
      }
      for (let i = 0; i < proj.tasks.length; i++) {
        taskCopy[i] = TaskJSONable.fromJSONable(proj.tasks[i]);
      }
      return new Project(this.id, this.name, peopleCopy, taskCopy);
    }
}

module.exports = {Project};