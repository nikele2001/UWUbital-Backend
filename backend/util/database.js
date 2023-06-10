const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "db4free.net",
  user: "nikele",
  database: "uwubital",
  password: "16December2001!",
});

module.exports = pool.promise();
