const dotenv = require('dotenv');
dotenv.config({path:`${process.cwd()}/../config.env`});//is recipe! not concept these two lines now gives eyes to our rest of code to see what's present in config.env file.😎🙏

const { Client } = require('pg');
const { buildWhereClause } = require('./queryToStreamDataFromDB.js');// Note: this file is certain to use many more queries using native postgres query system. the "getDistinctExamName()" isn't using it, becouse the where clause is static. But going forward, if we make up mind to add more postgres native clause, we may need to use this buildwhereClause.Hence imported. 


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
        text: 'SELECT DISTINCT "EXAMNAME" FROM allexamstable_partitioned WHERE "EXAMNAME" IS NOT NULL ORDER BY "EXAMNAME"',
        values: []
      };
  
      console.log('Executing query:', query); // Debug log
  
      const result = await pgClient.query(query);
      return result.rows.map(row => row.EXAMNAME);
  
    } catch (error) {
      console.error('Error in getDistinctExamNames:', error);
      throw error;
    } finally {
      // Clean up connection if we created it
      if (needToCloseClient && pgClient) {
        await pgClient.end();
      }
    }
  };

module.exports = { getDistinctExamNames };