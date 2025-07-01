const dotenv = require('dotenv');
dotenv.config({path:`${process.cwd()}/../config.env`});//is recipe! not concept these two lines now gives eyes to our rest of code to see what's present in config.env file.😎🙏

const { Client } = require('pg');
const { buildWhereClause } = require('./queryToStreamDataFromDB.js');// Note: this file is certain to use many more queries using native postgres query system. the "getDistinctExamName()" isn't using it(buildWhereClause), becouse the where clause is static. But going forward, if we make up mind to add more postgres native clause, we may need to use this buildwhereClause.Hence imported. 


// ConceptRemember It: if you are going to use native query to connect to postgres, by default, it treats all the fieldnames of the table in the small case. That is, EXAMNAME will be treated as "examname".And this will give rise to connection failure and missing field name in the table. to avoied it, you have to mention your fieldname in "". like "EXAMNAME". It is becouse of this, that you see such a extensive use of "" in the buildWhereClause function.


/**
 * Creates query based on provided filters
 */
const getDistinctExamNames = async (client) => {
    let pgClient;
    let needToCloseClient = false;
  
    try {
      // Handle both client instance and connection string
      if (client instanceof Client) {
        pgClient = client;
      } else if (typeof client === 'string') {
        pgClient = new Client({ connectionString: client });
        await pgClient.connect();
        needToCloseClient = true;
      } else {
        throw new Error("Invalid client provided");
      }
  
      // Simple query to get distinct EXAMNAME values
      const query = {
        text: 'SELECT DISTINCT "examname" FROM exam_filter_cache WHERE "examname" IS NOT NULL ORDER BY "examname"',
        values: []
      };
  
      console.log('Executing query:', query); // debugging log
  
      const result = await pgClient.query(query);
      console.log('Output of the Query execution:', result); // debugging log
      return result.rows.map(row => row.examname);
  
    } catch (error) {
      console.error('Error in function getDistinctExamNames:', error);
      throw error;
    } finally {
      // Clean up connection if we has successfully created it
      if (needToCloseClient && pgClient) {
        await pgClient.end();
      }
    }
  };

  // TO GET fiter DATA FOR SPECIFIC EXAMNAME
  const getExamFilters = async (examName, client) => {
    let pgClient; 
    let needToCloseClient = false;

    try {
      // Handle both client instance and connection string
      if (client instanceof Client) {
        pgClient = client;
      } else if (typeof client === 'string') {
        pgClient = new Client({ connectionString: client });
        await pgClient.connect();
        needToCloseClient = true;
      } else {
        throw new Error("Invalid client provided");
      }

      // Query to get filters for a specific exam name
      const query = {
        text: 'SELECT "filters" FROM exam_filter_cache WHERE "examname" = $1',
        values: [examName]
      };

      console.log('Executing query:\n', query); // debugging log

      const result = await pgClient.query(query);
      console.log('Output of the Query execution:\n', result); // debugging log

      if (result.rows.length > 0) {
        return result.rows[0].filters; // Assuming filters is a JSON object
      } else {
        return null; // No filters found for the given exam name
      }
    } catch (error) {
      console.error('Error in function getExamFilters:', error);
      throw error;
    } finally {
      // Clean up connection if we has successfully created it
      if (needToCloseClient && pgClient) {
        await pgClient.end();
      }
    }
  };

module.exports = { getDistinctExamNames, getExamFilters };