const { text } = require('express');
const { Client } = require('pg');
const QueryStream = require('pg-query-stream');

// ConceptRemember It: if you are going to use native query to connect to postgres, by default, it treats all the fieldnames of the table in the small case. That is, EXAMNAME will be treated as "examname".And this will give rise to connection failure and missing field name in the table. to avoied it, you have to mention your fieldname in "". like "EXAMNAME". It is becouse of this, that you see such a extensive use of "" in the buildWhereClause function.

const buildWhereClause = (filters = {}) => {
  const conditions = [];
  const parameters = [];
  let paramCount = 1;

  console.log('Received filters:', filters); // Debug log

  /**
   * Helper function to add conditions to the WHERE clause only if the field exists in filters
   */
  const addCondition = (field, customHandler) => {    
    // Only add condition if the field exists in filters
    if (field in filters) {
      const value = filters[field];
      
      if (customHandler) {
        const result = customHandler(`"${field}"`, value, paramCount);
        if (result) {
          conditions.push(result.condition);
          if (result.params) {
            parameters.push(...result.params);
            paramCount += result.params.length;
          }
        }
      } else {
        if (value === "") {
          conditions.push(`"${field}" IS NULL`);
        } else {
          conditions.push(`"${field}" = $${paramCount}`);
          parameters.push(value);
          paramCount++;
        }
      }
    }
  };

  // EXAMNAME handling
  addCondition('EXAMNAME', (field, value, pCount) => {
    if (value === "") {
      return { condition: `${field} IS NULL` };
    } else if (value === "ALL EXAMs") {
      return { condition: `${field} IS NOT NULL` };
    } else {
      return {
        condition: `${field} = $${pCount}`,
        params: [value]
      };
    }
  });

  // Add conditions only if they exist in filters
  const fields = [
    'REGID', 'ROLL', 'NAME', 'FATHERNAME', 'MOTHERNAME', 'DOB'
  ];
  fields.forEach(field => addCondition(field));

  // GENDER handling
  addCondition('GENDER', (field, value, pCount) => {
    if (value === "") {
      return { condition: `${field} IS NULL` };
    } else if (value === "OVERALL") {
      return { condition: `${field} IS NOT NULL` };
    } else if (value === "OTHERS") {
      return {
        condition: `${field} = $${pCount}`,
        params: ['T']
      };
    } else {
      return {
        condition: `${field} = $${pCount}`,
        params: [value]
      };
    }
  });

  // CAT1 handling
  addCondition('CAT1', (field, value, pCount) => {
    if (value === "") {
      return { condition: `${field} IS NULL` };
    } else if (value === "TOGETHER") {
      return { condition: `${field} IS NOT NULL` };
    } else {
      return {
        condition: `${field} = $${pCount}`,
        params: [value]
      };
    }
  });

  // Rest of the fields...
  // (Following the same pattern - only add if they exist in filters)
  const otherFields = [
    'CAT2', 'CAT3', 'WRTN1_APP', 'WRTN1_QLY', 'WRTN2_APP', 'WRTN2_QLY',
    'WRTN3_APP', 'WRTN3_QLY', 'INTVW_APP', 'SKILL_APP', 'SKILL_QLY',
    'PET_APP', 'PET_QLY', 'DME_APP', 'DME_QLY', 'RME_APP', 'RME_QLY',
    'SELECTED', 'MARKS', 'ALLOC_POST', 'ALLOC_STAT', 'ALLOC_AREA', 'RANK',
    'WITHHELD'
  ];
  otherFields.forEach(field => addCondition(field));

  // ALLOC_CAT handling
  addCondition('ALLOC_CAT', (field, value, pCount) => {
    if (value === "") {
      return { condition: `${field} IS NULL` };
    } else if (value === "ALL_TOGETHER") {
      return { condition: `${field} IS NOT NULL` };
    } else if (["0", "1", "2", "6"].includes(value)) {
      return {
        condition: `${field} IN ($${pCount}, $${pCount + 1}, $${pCount + 2}, $${pCount + 3}, $${pCount + 4}, $${pCount + 5})`,
        params: [value, '3', '4', '5', '7', '8']
      };
    } else if (value === "9") {
      return {
        condition: `(${field} = $${pCount} OR (${field} IN ($${pCount + 1}, $${pCount + 2}, $${pCount + 3}, $${pCount + 4}, $${pCount + 5}) AND "CAT1" = $${pCount + 6}))`,
        params: ['9', '3', '4', '5', '7', '8', '9']
      };
    } else {
      return {
        condition: `${field} = $${pCount}`,
        params: [value]
      };
    }
  });

  return {
    text: conditions.length > 0 ? conditions.join(' AND ') : '',
    values: parameters
  };
};

/**
 * Creates a streaming query based on provided filters
 */
const getRecordsByFiltersDataStream = async (filters, client) => {
  console.log(filters);//Code Testing
  
  let pgClient;
  let needToCloseClient = false;

  try {
    if (client instanceof Client) {
      pgClient = client;
    } else if (typeof client === 'string') {
      pgClient = new Client({ connectionString: client });
      await pgClient.connect();
      needToCloseClient = true;
    } else {
      throw new Error("Invalid client provided");
    }

    // console.log(REGID,ROLL);// Code Testing
    const whereClause = buildWhereClause(filters);
    const query = {
      text: `
        SELECT *
        FROM allexamstable
        ${whereClause.text ? `WHERE ${whereClause.text}` : ''}
      `,
      values: whereClause.values
    };

    console.log('Executing query:', {
      text: query.text,
      values: query.values
    });// Code Testing
    
    
    const queryStream = new QueryStream(query.text, query.values, {
      batchSize: 100, //Increased from default
      highWaterMark: 100 // Controls internal buffer size
    });
    return {
      stream: pgClient.query(queryStream),
      cleanup: async () => {
        if (needToCloseClient) {
          await pgClient.end();
        }
      }
    };
  } catch (error) {
    if (needToCloseClient && pgClient) {
      await pgClient.end();
    }
    throw error;
  }
};

module.exports = { buildWhereClause, getRecordsByFiltersDataStream };
