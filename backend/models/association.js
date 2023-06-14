// import entity models
const Person = require("./people");
const Project = require("./projects");
const TaskGroup = require("./taskgroups");
const Task = require("./tasks");

// import association tables
const {
  PersonProject,
  PersonTaskGroup,
  PersonTask,
  ProjectTaskGroup,
  ProjectTask,
  TaskGroupTask,
} = require("./relations");

module.exports = {
  createAssociations: function () {
    // relationship table between people and projects is a super many-to-many relationship, since many people can be in a project, and many projects can be participated by people
    // additionally, each record in the people_projects relationship table states a person's availability in the project
    Person.hasMany(PersonProject, {
      foreignKey: {
        name: "user_id",
      },
    });
    PersonProject.belongsTo(Person, {
      foreignKey: {
        name: "user_id",
      },
    });
    Project.hasMany(PersonProject, {
      foreignKey: {
        name: "project_id",
      },
    });
    PersonProject.belongsTo(Project, {
      foreignKey: {
        name: "project_id",
      },
    });

    Person.hasMany(PersonTaskGroup, {
      foreignKey: {
        name: "user_id",
      },
    });
    PersonTaskGroup.belongsTo(Person, {
      foreignKey: {
        name: "user_id",
      },
    });
    TaskGroup.hasMany(PersonTaskGroup, {
      foreignKey: {
        name: "group_id",
      },
    });
    PersonTaskGroup.belongsTo(TaskGroup, {
      foreignKey: {
        name: "group_id",
      },
    });

    Person.belongsToMany(Task, {
      foreignKey: {
        name: "user_id",
      },
      through: PersonTask,
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    Task.belongsToMany(Person, {
      foreignKey: {
        name: "task_id",
      },
      through: PersonTask,
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    Project.belongsToMany(TaskGroup, {
      foreignKey: {
        name: "project_id",
      },
      through: ProjectTaskGroup,
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    TaskGroup.belongsToMany(Project, {
      foreignKey: {
        name: "group_id",
      },
      through: ProjectTaskGroup,
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    Project.belongsToMany(Task, {
      foreignKey: {
        name: "project_id",
      },
      through: ProjectTask,
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    Task.belongsToMany(Project, {
      foreignKey: {
        name: "task_id",
      },
      through: ProjectTask,
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    TaskGroup.belongsToMany(Task, {
      foreignKey: {
        name: "group_id",
      },
      through: TaskGroupTask,
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    Task.belongsToMany(TaskGroup, {
      foreignKey: {
        name: "task_id",
      },
      through: TaskGroupTask,
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  },
};
