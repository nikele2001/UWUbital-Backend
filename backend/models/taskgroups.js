const { Sequelize, Model, DataTypes } = require("sequelize");

const sequelize = require("../util/database");

const TaskGroup = sequelize.define("taskgroups_table", {
  group_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
    unique: true,
  },
  task_group_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  pax: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = TaskGroup;
