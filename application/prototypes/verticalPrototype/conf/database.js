const mysql = require('mysql2');

const pool = mysql.createPool({
  host: '34.72.218.74',
  user: 'root',
  database: 'TestingDB',
  password: 'jnrscZTyvbdC1YG/',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
}).promise();

module.exports = pool;
