const { Sequelize, Model, DataTypes } = require("sequelize");

const sequelize = require("../util/database");

const Person = sequelize.define("people_table", {
  user_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
    unique: true,
  },
  user_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password_hash: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  jwt_token: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  bio: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = Person;
