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
  task_JSON: {
    type: DataTypes.STRING,
  },
  // completed: {
  //   type: DataTypes.BOOLEAN,
  //   allowNull: false,
  // },
  // preassigned: {
  //   type: DataTypes.BOOLEAN,
  //   allowNull: false,
  // },
  // priority: {
  //   type: DataTypes.BOOLEAN,
  //   allowNull: true,
  // },
});

module.exports = Task;
