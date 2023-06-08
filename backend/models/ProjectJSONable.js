const taskJSONable = require("./TaskJSONable");
const personJSONable = require("./PersonJSONable");
const project = require("./Project");

class ProjectJSONable {
  // id is a number
  // name is a string
  // people is an array of PersonJSONable objects
  // tasks is an array of TaskJSONable objects
  constructor(id, name, people, tasks) {
    this.id = id;
    this.name = name;
    this.people = people;
    this.tasks = tasks;
  }

  toString() {
    return (
      "ProjectJSONable " +
      this.name +
      "\nPeople: " +
      this.people +
      "\n Tasks: " +
      this.tasks +
      "\n"
    );
  }

  static fromJSONable(proj) {
    const peopleCopy = [];
    const taskCopy = [];
    for (let i = 0; i < proj.people.length; i++) {
      peopleCopy[i] = personJSONable.PersonJSONable.fromJSONable(
        proj.people[i]
      );
    }
    for (let i = 0; i < proj.tasks.length; i++) {
      taskCopy[i] = taskJSONable.TaskJSONable.fromJSONable(proj.tasks[i]);
    }
    return new project.Project(this.id, this.name, peopleCopy, taskCopy);
  }
}

module.exports = { ProjectJSONable };
