const mysql = require('mysql2');

const pool = mysql.createPool({
  // socketPath: '/cloudsql/csc-648-848-team-05:us-central1:artisan-aura-mysql-instance',
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
 