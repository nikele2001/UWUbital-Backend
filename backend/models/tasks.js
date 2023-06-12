const { Sequelize, Model, DataTypes } = require("sequelize");

const sequelize = require("../util/database");

const Task = sequelize.define("tasks_table", {
  task_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
    unique: true,
  },
  start_task_datetime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  end_task_datetime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  completed: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  preassigned: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
});

module.exports = Task;
