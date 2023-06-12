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

// const createAssociations = () => {
//   Person.belongsToMany(Project, {
//     through: PersonProject,
//     onDelete: "CASCADE",
//     onUpdate: "CASCADE",
//   });
//   Project.belongsToMany(Person, {
//     through: PersonProject,
//     onDelete: "CASCADE",
//     onUpdate: "CASCADE",
//   });
//   Person.belongsToMany(TaskGroup, {
//     through: PersonTaskGroup,
//     onDelete: "CASCADE",
//     onUpdate: "CASCADE",
//   });
//   TaskGroup.belongsToMany(Person, {
//     through: PersonTaskGroup,
//     onDelete: "CASCADE",
//     onUpdate: "CASCADE",
//   });
//   Person.belongsToMany(Task, {
//     through: PersonTask,
//     onDelete: "CASCADE",
//     onUpdate: "CASCADE",
//   });
//   Task.belongsToMany(Person, {
//     through: PersonTask,
//     onDelete: "CASCADE",
//     onUpdate: "CASCADE",
//   });
//   Project.belongsToMany(TaskGroup, {
//     through: ProjectTaskGroup,
//     onDelete: "CASCADE",
//     onUpdate: "CASCADE",
//   });
//   TaskGroup.belongsToMany(Project, {
//     through: ProjectTaskGroup,
//     onDelete: "CASCADE",
//     onUpdate: "CASCADE",
//   });
//   Project.belongsToMany(Task, {
//     through: ProjectTask,
//     onDelete: "CASCADE",
//     onUpdate: "CASCADE",
//   });
//   Task.belongsToMany(Project, {
//     through: ProjectTask,
//     onDelete: "CASCADE",
//     onUpdate: "CASCADE",
//   });
//   TaskGroup.belongsToMany(Task, {
//     through: TaskGroupTask,
//     onDelete: "CASCADE",
//     onUpdate: "CASCADE",
//   });
//   Task.belongsToMany(TaskGroup, {
//     through: TaskGroupTask,
//     onDelete: "CASCADE",
//     onUpdate: "CASCADE",
//   });
// };

module.exports = {
  createAssociations: function () {
    Person.belongsToMany(Project, {
      foreignKey: {
        name: "user_id",
      },
      through: PersonProject,
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    Project.belongsToMany(Person, {
      foreignKey: {
        name: "project_id",
      },
      through: PersonProject,
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    Person.belongsToMany(TaskGroup, {
      foreignKey: {
        name: "user_id",
      },
      through: PersonTaskGroup,
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    TaskGroup.belongsToMany(Person, {
      foreignKey: {
        name: "group_id",
      },
      through: PersonTaskGroup,
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
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
