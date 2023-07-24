const mysql = require('mysql2');

const pool = mysql.createPool({
  // socketPath: 'localhost',
  user: 'root',
  database: 'testing648',
  password: '1234',
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10,
  idleTimeout: 60000,
  queueLimit: 0,
}).promise();

module.exports = pool;
 