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
}

module.exports = {ProjectJSONable};