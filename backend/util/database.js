const mysql = require("mysql2");

// Creating a connection pool
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "node-complete",
  password: "16December2001!",
});

module.exports = pool.promise();
