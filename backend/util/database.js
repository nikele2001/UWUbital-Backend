const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "uwubital-schema",
  password: "16December2001!",
});

module.exports = pool.promise();
