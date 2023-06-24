class ProjectJSONable {
  // projectId is a number
  // projectName is a string
  // people is an array of PersonJSONable objects
  // taskGroups is an array of TaskGroupJSONable objects
  constructor(projectId, projectName, people, taskGroups) {
    this.projectId = projectId;
    this.projectName = projectName;
    this.people = people;
    this.taskGroups = taskGroups;
  }

  toString() {
    return (
      "ProjectJSONable " +
      this.projectName +
      "\nPeople: " +
      this.people +
      "\n taskGroups: " +
      this.taskGroups +
      "\n"
    );
  }
}

module.exports = { ProjectJSONable };
