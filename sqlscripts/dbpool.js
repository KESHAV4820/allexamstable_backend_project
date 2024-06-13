'use strict';
/*
1. this file is used to store the code for function calls stored within the postgres SQL. 
2. you will have to export the local names of these function of sql. 
3. you will have to import the function names in the app.js file.
*/

const { Pool, types } = require('pg');
const dotenv = require('dotenv');
dotenv.config({path:`${process.cwd()}/config.env`});

const pool = new Pool({
  user: process.env.DB_USERNAME,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Parse date/time values as JavaScript Date objects
types.setTypeParser(types.builtins.DATE, (value) => {
  return value === null ? null : new Date(value);
});

// Parse numeric values as JavaScript numbers
types.setTypeParser(types.builtins.NUMERIC, parseFloat);

/*
const callProcedure = async (procedureName, params) => {
  const client = await pool.connect();
  try {
    const result = await client.query(`SELECT * FROM ${procedureName}($1)`, params);
    const records=[];
    for await (const row of result){
        records.push(row);
    };
    return records;
  } catch (err) {
    console.error('Error executing procedure:', err);
    throw err;
  } finally {
    client.release();
  }
};
*/

/*
const callProcedure = async (procedureName, params) => {
  const client = await pool.connect();
  try {
    const result = await client.query(`SELECT * FROM ${procedureName}($1)`, params);
    const records = [];
    for await (const row of result) {
      records.push(row.out_record); // Access the out_record field
    }
    return records;
  } catch (err) {
    console.error('Error executing procedure:', err);
    throw err;
  } finally {
    client.release();
  }
};
*/

/*
const callProcedure = async (procedureName, params) => {
  const client = await pool.connect();
  try {
    const result = await client.query(`SELECT * FROM ${procedureName}($1)`, params);

    // If the function returns a set of records
    if (result.rows && Array.isArray(result.rows)) {
      return result.rows.map(row => row.out_record);
    }
    // If the function returns a single record
    else if (result.rows && result.rows.length === 1) {
      return result.rows[0].out_record;
    }
    // If the function doesn't return any records
    else {
      return null;
    }
  } catch (err) {
    console.error('Error executing procedure:', err);
    throw err;
  } finally {
    client.release();
  }
};
*/

//first Funtion call. This will be used to show all the data from database onto the frontend pasing via middleware. This function can run any SQL function, basically you have to pass the name of the stored function and number of the records that you would like to see in the output. 
const callStoredFunction = async (procedureName, params) => {
  const client = await pool.connect();
  try {
    const result = await client.query(`SELECT * FROM ${procedureName}($1)`, params);

    // If the function returns a set of records
    if (result.rows && Array.isArray(result.rows)) {
      return result.rows;
    }
    // If the function returns a single record
    else if (result.rows && result.rows.length === 1) {
      return result.rows[0];
    }
    // If the function doesn't return any records
    else {
      return null;
    }
  } catch (err) {
    console.error('Error executing procedure:', err);
    throw err;
  } finally {
    client.release();
  }
};

// Another Stored function call from postgres SQL to view number of records present for a particular query.
const callRecordViewFunction = async (procedureName, params) => {
  const client = await pool.connect();
  try {
    const result = await client.query(`SELECT ${procedureName}($1)`, params);
      //Code Testing console.warn(`Number of Records:`, {...result.rows[0]}.viewrecords1);// Super{...result.rows[0]}.viewrecords1 i used this pattern to bringout the output from inside of a an array of object where a property of an object has a value that needs to be broughtout.🙌⚡👍 
      return {...result.rows[0]}.viewrecords1;
    
  } catch (err) {
    console.error('Error executing procedure:', err);
    throw err;
  } finally {
    client.release();
  }
};

// Another Stored Function call( in postgres SQL) for downloading the .csv file for the query. Note: this is "un-split" file download. which is VERSION 1.0
const downloadQueryFunction = async (procedureName, params) => {
  try {
    await callStoredFunction('split_downloadqueryfunction2', ['allexamstable']);// first parameter is to pass the storedfunction name itself. Second parameter is to pass the the tablename.
    console.log('CSV file generated successfully at ', process.env.DB_File_DownloadedAt);
  } catch (err) {
    console.error('Error generating CSV file:', err);
  }
};

module.exports = { callStoredFunction, callRecordViewFunction, downloadQueryFunction };