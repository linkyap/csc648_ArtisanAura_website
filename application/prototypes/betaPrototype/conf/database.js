 const mysql = require('mysql2');

const pool = mysql.createPool({
  host: '34.72.218.74',
  user: 'root',
  database: 'artisanAura',
  password: 'jnrscZTyvbdC1YG/',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
}).promise();

module.exports = pool;



//^^^^^^^^^^^ uncomment above for local testing ^^^^^^^^^^^^^^^^^^^^
//vvvvvvvvvvvv comment below for local testing vvvvvvvvvvvvvvvvvvvvvvvvvv
//----------------------------------------------
//^^^^^^^^^^^ comment above for web testing ^^^^^^^^^^^^^^^^^^^^
//vvvvvvvvvvvv uncomment below for web testing vvvvvvvvvvvvvvvvvvvvvvvvvv


// const mysql = require('mysql2');

// const pool = mysql.createPool({
//   socketPath: '/cloudsql/csc-648-848-team-05:us-central1:artisan-aura-mysql-instance',
//   user: 'root',
//   database: 'artisanAura',
//   password: 'jnrscZTyvbdC1YG/',
//   waitForConnections: true,
//   connectionLimit: 10,
//   maxIdle: 100,
//   idleTimeout: 60000,
//   queueLimit: 0,
// }).promise();

// module.exports = pool;