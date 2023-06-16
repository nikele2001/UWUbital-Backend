// const mysql = require("mysql2");

// const pool = mysql.createPool({
//   host: "db4free.net",
//   user: "nikele",
//   database: "uwubital",
//   password: "16December2001!",
// });

// module.exports = pool.promise();

const Sequelize = require("sequelize");

const sequelize = new Sequelize("uwubital", "nikele", "16December2001!", {
  dialect: "mysql",
  host: "db4free.net",
  define: {
    freezeTableName: true,
    timestamps: false,
  },
});

module.exports = sequelize;
