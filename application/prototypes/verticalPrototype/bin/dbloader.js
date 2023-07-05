"use strict";
const mysql = require("mysql2/promise");


function displayWarningMessage(warning) {
  switch (warning.Code) {
    case 1007:
      console.log(`Skipping Database Creation --> ${warning.Message}`);
      break;
    case 1050:
      console.log(`Skipping Table Creation --> ${warning.Message}`);
      break;
  }
}

async function getConnection() {
    return await mysql.createConnection({
      host: '34.72.218.74',
      //TODO make sure to change to the user you want to use
      user: 'root', //Your DB username
      //TODO make sure to change to the correct password for your user.
      password: 'jnrscZTyvbdC1YG/', //Your DB password
      port: '3306',
     
    });
}
  
async function makeDatabase(connection) {
    //TODO make sure to change yourdbnamehere
    const [result, _] = await connection.query(
      `CREATE DATABASE IF NOT EXISTS TestingDB;`
    );
    if (result && result.warningStatus > 0) {
      const [warningResult, _] = await connection.query("SHOW WARNINGS");
      displayWarningMessage(warningResult[0]);
    } else {
      console.log("Created Database!");
    }
}

async function makeUsersTable(connection) {
    const [result, _] = await connection.query(
      // Users Table SQL Goes here
      `CREATE TABLE IF NOT EXISTS TestingDB.users (
        id INT UNSIGNED NOT NULL AUTO_INCREMENT,
        email VARCHAR(128) NOT NULL,
        passwork VARCHAR(255) NOT NULL,
        username VARCHAR(64) NOT NULL,
        createdAt DATETIME NOT NULL DEFAULT current_timestamp,
        updatedAt DATETIME NOT NULL DEFAULT current_timestamp,
        PRIMARY KEY (id),
        UNIQUE INDEX id_UNIQUE (id ASC) VISIBLE,
        UNIQUE INDEX username_UNIQUE (username ASC) VISIBLE)
      ENGINE = InnoDB
      `
    );
  
    if (result && result.warningStatus > 0) {
      const [warningResult, _] = await connection.query("SHOW WARNINGS");
      displayWarningMessage(warningResult[0]);
    } else {
      console.log("Created Users Table!");
    }
}

async function makeItemsTable(connection) {
    const [result, _] = await connection.query(
      // Items Table SQL Goes here
      `CREATE TABLE IF NOT EXISTS TestingDB.items (
        id INT UNSIGNED NOT NULL AUTO_INCREMENT,
        name VARCHAR(128) NOT NULL,
        description TEXT NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        image VARCHAR(255) NOT NULL,
        createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
      ) ENGINE = InnoDB;
      `
    );
  
    if (result && result.warningStatus > 0) {
      const [warningResult, _] = await connection.query("SHOW WARNINGS");
      displayWarningMessage(warningResult[0]);
    } else {
      console.log("Created Items Table!");
    }
  }
  
  (async function main() {
    let connection = null;
    try {
      connection = await getConnection();
      await makeDatabase(connection); // make DB
      //TODO make sure to change yourdbnamehere
      await connection.query(`USE TestingDB`); // set new DB to the current DB
      await makeUsersTable(connection); // try to make user table
      await makeItemsTable(connection); // try to make posts table
      connection.close();
      return;
    } catch (error) {
      console.error(error);
      if (connection != null) {
        connection.close();
      }
    }
  })();