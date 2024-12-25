const { Client } = require('pg');
const QueryStream = require('pg-query-stream');

const getRecordsByFiltersDataStream = async (filters, client) => {
  let pgClient;
  let needToCloseClient = false;

  try {
    // Setup client
    if (client instanceof Client) {
      pgClient = client;
    } else if (typeof client === 'string') {
      pgClient = new Client({ connectionString: client });
      await pgClient.connect();
      needToCloseClient = true;
    } else {
      throw new Error("Invalid client provided");
    }

    const whereClause = buildWhereClause(filters);
    const query = `
      SELECT *
      FROM allexamstable
      ${whereClause.length > 0 ? `WHERE ${whereClause.join(' AND ')}` : ''}
      ORDER BY ${filters.orderBy || 'EXAMNAME ASC, RANK ASC'}
    `;
    
    const queryStream = new QueryStream(query);
    return {
      stream: pgClient.query(queryStream),
      cleanup: async () => {
        if (needToCloseClient) {
          await pgClient.end();
        }
      }
    };
  } catch (error) {
    if (needToCloseClient) {
      await pgClient.end();
    }
    throw error;
  }
};

module.exports = {getRecordsByFiltersDataStream};