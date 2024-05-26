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

//first procedure call
const callProcedure = async (procedureName, params) => {
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

// Another procedure call
const callProcedtesting11 = async (tableName) => {
  try {
    await callProcedure('procedtesting11', [tableName]);
    console.log('CSV file generated successfully at ', process.env.DB_File_DownloadedAt);
  } catch (err) {
    console.error('Error generating CSV file:', err);
  }
};

module.exports = { callProcedure, callProcedtesting11 };