const { Sequelize, Model, DataTypes } = require("sequelize");

const sequelize = require("../util/database");

const PersonProject = sequelize.define("people_projects_table", {
  relation_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
    unique: true,
  },
  permission: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  availability_start: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  availability_end: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

const PersonTaskGroup = sequelize.define("people_taskgroups_table", {
  relation_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
    unique: true,
  },
});

const PersonTask = sequelize.define("people_tasks_table", {
  relation_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
    unique: true,
  },
});

const ProjectTaskGroup = sequelize.define("projects_taskgroups_table", {
  relation_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
    unique: true,
  },
});

const ProjectTask = sequelize.define("projects_tasks_table", {
  relation_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
    unique: true,
  },
});

const TaskGroupTask = sequelize.define("taskgroups_tasks_table", {
  relation_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
    unique: true,
  },
});

module.exports = {
  PersonProject,
  PersonTaskGroup,
  PersonTask,
  ProjectTaskGroup,
  ProjectTask,
  TaskGroupTask,
};
