class ProjectJSONable {
    // id is a number
    // name is a string
    // people is an array of PersonJSONable objects
    // taskGroups is an array of TaskGroupJSONable objects
    constructor(id, name, people, taskGroups) {
      this.id = id;
      this.name = name;
      this.people = people;
      this.taskGroups = taskGroups;
    }
  
    toString() {
      return (
        "ProjectJSONable " +
        this.name +
        "\nPeople: " +
        this.people +
        "\n taskGroups: " +
        this.taskGroups +
        "\n"
      );
    }
}

module.exports = {ProjectJSONable};