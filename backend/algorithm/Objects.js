import { DateTime, Interval } from "luxon";

export class Project {
    constructor(people, tasks) {
        this.people = people;
        this.tasks = tasks;
    }
    toString() {
        return "People: " + this.people + "\n Tasks: " + this.tasks + "\n";
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
        return new ProjectJSONable(peopleCopy, taskCopy);
    }
}

export class ProjectJSONable {
    constructor(people, tasks) {
        this.people = people;
        this.tasks = tasks;
    }

    toString() {
        return "People: " + this.people + "\n Tasks: " + this.tasks + "\n";
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
        return new Project(peopleCopy, taskCopy);
    }
}

export class Person {
    // name is a string
    // avail is an array of Interval objects from the Luxon library
    constructor(name, avails, tasks) {
        this.name = name;
        this.avails = avails;
        this.tasks = tasks;
    }

    toString() {
        var out = "Name: " + this.name + "\n";
        out += "Availabilities: ";
        for (var avail of this.avails) {
            out += avail.toLocaleString(DateTime.DATETIME_MED) + "\n";
        }
        out += "Tasks: ";
        for (var task of this.tasks) {
            out += task.toString() + "\n";
        }
        return out;
    }

    toJSONable() {
        const outAvails = [];
        for (let i = 0; i < this.avails.length; i++) {
            outAvails[i] = this.avails[i].toISO({suppressSeconds: true});
        }
        const outTasks = [];
        for (let i = 0; i < this.tasks.length; i++) {
            outTasks[i] = this.tasks[i].toJSONable();
        }
        return new PersonJSONable(this.name, outAvails, outTasks);
    }

    canTakeTask(task) {
        let out = true;
        for (let avail of this.avails) {
            out = avail.engulfs(task.interval) || out;
        }
        return out;
    }

    takeNewTask(task) {
        this.tasks = [...this.tasks, task];
    }
    getWorkload() {
        return Task.calculateTotalWorkload(this.tasks);
    }
    static getTotalWorkload(personArray) {
        let out = 0;
        for (let person of personArray) {
            out += person.getWorkload();
        }
        return out;
    }
}

export class PersonJSONable {
    // name is a string
    // avail is an array of ISO strings
    constructor(name, avails, tasks) {
        this.name = name;
        this.avails = avails;
        this.tasks = tasks;
    }

    toString() {
        var out = "JSON \n Name: " + this.name + "\n";
        out += "Availabilities: ";
        for (var avail of this.avails) {
            out += avail.toString() + "\n";
        }
        out += "Tasks: ";
        for (var task of this.tasks) {
            out += task.toString() + "\n";
        }
        return out;
    }

    static fromJSONable(object) {
        const outAvails = [];
        for (let i = 0; i < object.avails.length; i++) {
            outAvails[i] = Interval.fromISO(object.avails[i]);
        }
        const outTasks = [];
        for (let i = 0; i < object.tasks.length; i++) {
            outTasks[i] = TaskJSONable.fromJSONable(object.tasks[i]);
        }
        return new Person(object.name, outAvails, outTasks);
    }
}

export class Task {
    // name is a String
    // pax is an integer
    // timeframe is an Interval object
    // timeNeeded is a number
    constructor(name, pax, interval) {
        this.name = name;
        this.pax = pax;
        this.interval = interval;
    }
    getInterval() {
        return this.interval.toLocaleString(DateTime.DATETIME_MED);
    }
    getTimeNeeded() {
        return Math.round(this.interval.toDuration("hours").toObject().hours);
    }
    toString() {
        var out = "Task: " + this.name + "\n";
        out += "People required: " + this.pax + "\n";
        out += "Interval: " + this.interval.toLocaleString(DateTime.DATETIME_MED) + "\n";
        out += "Time needed: " + this.getTimeNeeded() + "\n";
        return out;
    }
    toJSONable() {
        const outInterval = this.interval.toISO({suppressSeconds: true});
        return new TaskJSONable(this.name, this.pax, outInterval);
    }
    static calculateTotalWorkload(taskArray) {
        let out = 0;
        for (let task of taskArray) {
            out += task.getTimeNeeded();
        }
        return out;
    }
}

export class TaskJSONable {
    // name is a String
    // pax is an integer
    // timeframe is an ISO string
    // timeNeeded is a number
    constructor(name, pax, interval) {
        this.name = name;
        this.pax = pax;
        this.interval = interval;
    }
    toString() {
        var out = "JSON \n Task: " + this.name + "\n";
        out += "People required: " + this.pax + "\n";
        out += "Interval: " + this.interval + "\n";
        return out;
    }

    static fromJSONable(object) {
        const outInterval = Interval.fromISO(object.interval);
        return new Task(object.name, object.pax, outInterval);
    }
}