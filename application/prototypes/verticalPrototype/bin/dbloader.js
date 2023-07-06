"use strict";
const mysql = require("mysql2/promise");

const connectionConfig = {
  host: '34.72.218.74',
  user: 'root',
  password: 'jnrscZTyvbdC1YG/',
  database: 'TestingDB',
  privateKey: '../application/credentials/id_rsa',//maybe add ../ infrom if doesnt work 
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
    console.log('Cdisconnected');
  } catch (error) {
    console.error('Error:', error);
    if (connection) {
      console.log('error,connection closing');
      connection.end();
    }
  }
}

main();
