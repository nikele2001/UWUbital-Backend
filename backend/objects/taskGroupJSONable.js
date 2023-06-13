class TaskGroupJSONable {
    // id is number
    // name is string
    // tasks is a TaskJSONable array
    // pax is a number
    // priority is a number
    constructor(id, name, tasks, pax, priority) {
        this.id = id;
        this.name = name;
        this.tasks = tasks;
        this.pax = pax;
        this.priority = priority;
    }
    toString() {
        let out = "Task Group JSON " + this.name + ":\n";
        for (const task of this.tasks) {
            out += task.toString();
        }
        return out;
    }
}

module.exports = {TaskGroupJSONable};