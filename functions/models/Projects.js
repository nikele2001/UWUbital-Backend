const { Sequelize, Model, DataTypes } = require("sequelize");

const sequelize = require("../util/database");

const Project = sequelize.define("projects_table", {
  project_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
    unique: true,
  },
  project_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Project;
