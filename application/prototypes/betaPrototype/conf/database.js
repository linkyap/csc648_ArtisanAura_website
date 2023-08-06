<<<<<<< HEAD
//---- LOCAL TESTING ----
// const mysql = require('mysql2');
=======
//  const mysql = require('mysql2');
>>>>>>> f073a7ebfb0781a64111158069fe416f395df2cd

// const pool = mysql.createPool({
//   host: '34.72.218.74',
//   user: 'root',
//   database: 'artisanAura',
//   password: 'jnrscZTyvbdC1YG/',
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0
// }).promise();

// module.exports = pool;

<<<<<<< HEAD
// ---- WEB TESTING ----
=======


//^^^^^^^^^^^ uncomment above for local testing ^^^^^^^^^^^^^^^^^^^^
//vvvvvvvvvvvv comment below for local testing vvvvvvvvvvvvvvvvvvvvvvvvvv
//----------------------------------------------
//^^^^^^^^^^^ comment above for web testing ^^^^^^^^^^^^^^^^^^^^
//vvvvvvvvvvvv uncomment below for web testing vvvvvvvvvvvvvvvvvvvvvvvvvv


>>>>>>> f073a7ebfb0781a64111158069fe416f395df2cd
const mysql = require('mysql2');

const pool = mysql.createPool({
  socketPath: '/cloudsql/csc-648-848-team-05:us-central1:artisan-aura-mysql-instance',
  user: 'root',
  database: 'artisanAura',
  password: 'jnrscZTyvbdC1YG/',
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 100,
  idleTimeout: 60000,
  queueLimit: 0,
}).promise();

module.exports = pool;