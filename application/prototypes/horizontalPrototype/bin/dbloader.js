const mysql = require('mysql2/promise');

const connectionConfig = {
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'testing648',
};

async function main() {
  let connection;
  try {
    connection = await mysql.createConnection(connectionConfig);
    console.log('database connected');
    //
    const [rows, fields] = await connection.execute('to be done');
    console.log('Result:', rows);
    console.log('disconnecting from db');
    connection.end();
    console.log('Disconnected');
  } catch (error) {
    console.error('Error:', error);
    if (connection) {
      console.log('Error, closing connection');
      connection.end();
    }
  }
} 

main();
