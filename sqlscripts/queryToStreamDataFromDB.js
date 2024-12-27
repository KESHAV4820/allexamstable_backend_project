const { text } = require('express');
const { Client } = require('pg');
const QueryStream = require('pg-query-stream');

/*legacy code code is good but vulnarable to SQL injection attacks. 
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
*/

//forced stop becouse of Bug
/*
//  * Trying to build a parameterised WHERE clause for native PostgreSQL queries being used in getRecordsByFilterDataStream() based on provided filters.
//  * It includes input validations and SQL injection prevention mechanism of simple kind.
//  * @param {Object} filters - Object containing filter conditions comming from frontend
//  * @returns {Object} Object containing query text and parameter values

const buildWhereClause = (filters) => {
  // const { EXAMNAME, REGID, ROLL, NAME, FATHERNAME, MOTHERNAME, DOB, GENDER, CAT1, CAT2, CAT3, WRTN1_APP, WRTN1_QLY, WRTN2_APP, WRTN2_QLY, WRTN3_APP, WRTN3_QLY, INTVW_APP, SKILL_APP, SKILL_QLY, PET_APP, PET_QLY, DME_APP, DME_QLY, RME_APP, RME_QLY, SELECTED, MARKS, ALLOC_POST, ALLOC_STAT, ALLOC_AREA, ALLOC_CAT, RANK, WITHHELD } = filters;
  console.log(filters);
  

  // Arrays to store WHERE conditions and parameter values for dynamic mapping of the two.
  const conditions = [];
  const parameters = [];
  let paramCount = 1;  // Counter for PostgreSQL $1, $2, etc. These numbers are actually place holder parameters.

  
  //  * Validation if a value is a string and it is within the acceptable length, length which can be increased or decreased by useNote.
  //  * @param {any} str - Value to validate
  //  * @returns {boolean} True if valid string
  const isValidString = (str) => {
    return typeof str === 'string' && str.length <= 1000;
  };

  
  //  * Validates if a string is a valid date or empty
  //  * @param {string} dateStr - we are using Date string to validate
  //  * @returns {boolean} True if valid date or empty string
    
  const isValidDate = (dateStr) => {
    const date = new Date(dateStr);
    return dateStr === "" || (date instanceof Date && !isNaN(date));
  };

  
  //  * Helper function to add conditions into the WHERE clause
  //  * it handles both simple equality conditions and complex custom conditions
  //  * @param {string} field - Database field name
  //  * @param {any} value - Value to compare against
  //  * @param {Function} customHandler - Optional custom handling function for complex conditions
   
  const addCondition = (field, value, customHandler) => {
    if (value === undefined) return;
    
    if (customHandler) {
      // Use custom handling logic if provided
      const result = customHandler(field, value, paramCount);
      if (result) {
        conditions.push(result.condition);
        if (result.params) {
          parameters.push(...result.params);
          paramCount += result.params.length;
        }
      }
    } else {
      // Default handling for simple equality conditions
      if (value === "") {
        conditions.push(`${field} IS NULL`);
      } else {
        conditions.push(`${field} = $${paramCount}`);
        parameters.push(value);
        paramCount++;
      }
    }
  };

  // EXAMNAME handling with special cases
  if (filters.EXAMNAME !== undefined) {
    if (!isValidString(filters.EXAMNAME)) {
      throw new Error("Invalid EXAMNAME format");
    }
    addCondition('EXAMNAME', filters.EXAMNAME, (field, value, pCount) => {
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
  }

  // Process basic string fields that only need simple equality checks
  const stringFields = ['REGID', 'ROLL', 'NAME', 'FATHERNAME', 'MOTHERNAME'];
  stringFields.forEach(field => {
    if (filters[field] !== undefined) {
      if (!isValidString(filters[field])) {
        throw new Error(`Invalid ${field} format`);
      }
      addCondition(field, filters[field]);
    }
  });

  // DOB handling with date validation
  if (filters.DOB !== undefined) {
    if (!isValidDate(filters.DOB)) {
      throw new Error("Invalid DOB format");
    }
    addCondition('DOB', filters.DOB);
  }

  // GENDER handling with special cases
  if (filters.GENDER !== undefined) {
    if (!isValidString(filters.GENDER)) {
      throw new Error("Invalid GENDER format");
    }
    addCondition('GENDER', filters.GENDER, (field, value, pCount) => {
      if (value === "") {
        return { condition: `${field} IS NULL` };
      } else if (value === "OVERALL") {
        return { condition: `${field} IS NOT NULL` };
      } else if (value === "OTHERS") {
        return {
          condition: `${field} = $${pCount}`,
          params: ['T']  // 'T' represents OTHERS in the database
        };
      } else {
        return {
          condition: `${field} = $${pCount}`,
          params: [value]
        };
      }
    });
  }

  // CAT1 handling with TOGETHER special case
  if (filters.CAT1 !== undefined) {
    if (!isValidString(filters.CAT1)) {
      throw new Error("Invalid CAT1 format");
    }
    addCondition('CAT1', filters.CAT1, (field, value, pCount) => {
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
  }

  // CAT2 handling with 'N' as null equivalent
  if (filters.CAT2 !== undefined) {
    if (!isValidString(filters.CAT2)) {
      throw new Error("Invalid CAT2 format");
    }
    addCondition('CAT2', filters.CAT2, (field, value, pCount) => {
      if (value === "" || value === "N") {
        return { condition: `${field} IS NULL` };
      } else {
        return {
          condition: `${field} = $${pCount}`,
          params: [value]
        };
      }
    });
  }

  // CAT3 handling with TOGETHER special case
  if (filters.CAT3 !== undefined) {
    if (!isValidString(filters.CAT3)) {
      throw new Error("Invalid CAT3 format");
    }
    addCondition('CAT3', filters.CAT3, (field, value, pCount) => {
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
  }

  // Status fields with simple NULL/value checks
  const statusFields = [
    'WRTN1_APP', 'WRTN1_QLY', 'WRTN2_APP', 'WRTN2_QLY', 'WRTN3_APP', 'WRTN3_QLY',
    'INTVW_APP', 'SKILL_APP', 'SKILL_QLY', 'PET_APP', 'PET_QLY', 'DME_APP',
    'DME_QLY', 'RME_APP', 'RME_QLY', 'SELECTED', 'MARKS', 'ALLOC_POST',
    'ALLOC_STAT', 'ALLOC_AREA', 'RANK', 'WITHHELD'
  ];

  statusFields.forEach(field => {
    if (filters[field] !== undefined) {
      if (!isValidString(filters[field])) {
        throw new Error(`Invalid ${field} format`);
      }
      addCondition(field, filters[field]);
    }
  });

  // ALLOC_CAT handling with complex conditions VIE Take A Good Look
  if (filters.ALLOC_CAT !== undefined) {
    if (!isValidString(filters.ALLOC_CAT)) {
      throw new Error("Invalid ALLOC_CAT format");
    };
    addCondition('ALLOC_CAT', filters.ALLOC_CAT, (field, value, pCount) => {
      if (value === "") {
        return { condition: `${field} IS NULL` };
      } else if (value === "ALL_TOGETHER") {
        return { condition: `${field} IS NOT NULL` };
      } else if (["0", "1", "2", "6"].includes(value)) {
        // For these values, include additional categories 3,4,5,7,8
        return {
          condition: `${field} IN ($${pCount}, $${pCount + 1}, $${pCount + 2}, $${pCount + 3}, $${pCount + 4}, $${pCount + 5})`,
          params: [value, '3', '4', '5', '7', '8']
        };
      } else if (value === "9") {
        // Special case for category 9 with complex OR condition
        return {
          condition: `(${field} = $${pCount} OR (${field} IN ($${pCount + 1}, $${pCount + 2}, $${pCount + 3}, $${pCount + 4}, $${pCount + 5}) AND CAT1 = $${pCount + 6}))`,
          params: ['9', '3', '4', '5', '7', '8', '9']
        };
      } else {
        return {
          condition: `${field} = $${pCount}`,
          params: [value]
        };
      }
    });
  }

  // Return both the WHERE clause text and parameter values
  return {
    text: conditions.join(' AND '),
    values: parameters
  };
};

// Example usage in your main query function:
const getRecordsByFiltersDataStream = async (filters, client) => {
  // const { EXAMNAME, REGID, ROLL, NAME, FATHERNAME, MOTHERNAME, DOB, GENDER, CAT1, CAT2, CAT3, WRTN1_APP, WRTN1_QLY, WRTN2_APP, WRTN2_QLY, WRTN3_APP, WRTN3_QLY, INTVW_APP, SKILL_APP, SKILL_QLY, PET_APP, PET_QLY, DME_APP, DME_QLY, RME_APP, RME_QLY, SELECTED, MARKS, ALLOC_POST, ALLOC_STAT, ALLOC_AREA, ALLOC_CAT, RANK, WITHHELD } = filters;
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

    const whereClause = buildWhereClause(filters);
    const query = {
      text: `
        SELECT *
        FROM allexamstable
        ${whereClause.text ? `WHERE ${whereClause.text}` : ''}
        ORDER BY ${filters.orderBy || 'EXAMNAME ASC, RANK ASC'}
      `,
      values: whereClause.values
    };
    
    const queryStream = new QueryStream(query.text, query.values);
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

module.exports = { buildWhereClause, getRecordsByFiltersDataStream };
*/

/**
 * Builds a parameterized WHERE clause for PostgreSQL queries based on provided filters.
 * @param {Object} filters - Object containing filter conditions
 * @returns {Object} Object containing query text and parameter values
 */
/*Buggy code. Has problem with the use of "" value which is being used as default value, but leads to the case where the undefined values become "is null".
const buildWhereClause = (filters = {}) => {
  // Destructure all possible fields with default empty string values
  const {
    EXAMNAME = '',
    REGID = '',
    ROLL = '',
    NAME = '',
    FATHERNAME = '',
    MOTHERNAME = '',
    DOB = '',
    GENDER = '',
    CAT1 = '',
    CAT2 = '',
    CAT3 = '',
    WRTN1_APP = '',
    WRTN1_QLY = '',
    WRTN2_APP = '',
    WRTN2_QLY = '',
    WRTN3_APP = '',
    WRTN3_QLY = '',
    INTVW_APP = '',
    SKILL_APP = '',
    SKILL_QLY = '',
    PET_APP = '',
    PET_QLY = '',
    DME_APP = '',
    DME_QLY = '',
    RME_APP = '',
    RME_QLY = '',
    SELECTED = '',
    MARKS = '',
    ALLOC_POST = '',
    ALLOC_STAT = '',
    ALLOC_AREA = '',
    ALLOC_CAT = '',
    RANK = '',
    WITHHELD = ''
  } = filters;

  const conditions = [];
  const parameters = [];
  let paramCount = 1;

  console.log(conditions);// Code Testing
  console.log(paramCount);// Code Testing
  console.log(filters);// Code Testing
  
  
  
  
   // Helper function to add conditions to the WHERE clause
   
  const addCondition = (field, value, customHandler) => {    
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
  };

  // Now we can directly reference the destructured variables
  // EXAMNAME handling
  addCondition('EXAMNAME', EXAMNAME, (field, value, pCount) => {
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

  // Basic string fields
  addCondition('REGID', REGID);
  addCondition('ROLL', ROLL);
  addCondition('NAME', NAME);
  addCondition('FATHERNAME', FATHERNAME);
  addCondition('MOTHERNAME', MOTHERNAME);
  addCondition('DOB', DOB);

  // GENDER handling
  addCondition('GENDER', GENDER, (field, value, pCount) => {
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
  addCondition('CAT1', CAT1, (field, value, pCount) => {
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

  // CAT2 handling
  addCondition('CAT2', CAT2, (field, value, pCount) => {
    if (value === "" || value === "N") {
      return { condition: `${field} IS NULL` };
    } else {
      return {
        condition: `${field} = $${pCount}`,
        params: [value]
      };
    }
  });

  // CAT3 handling
  addCondition('CAT3', CAT3, (field, value, pCount) => {
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

  // Status fields
  const statusFields = [
    ['WRTN1_APP', WRTN1_APP], ['WRTN1_QLY', WRTN1_QLY],
    ['WRTN2_APP', WRTN2_APP], ['WRTN2_QLY', WRTN2_QLY],
    ['WRTN3_APP', WRTN3_APP], ['WRTN3_QLY', WRTN3_QLY],
    ['INTVW_APP', INTVW_APP],
    ['SKILL_APP', SKILL_APP], ['SKILL_QLY', SKILL_QLY],
    ['PET_APP', PET_APP], ['PET_QLY', PET_QLY],
    ['DME_APP', DME_APP], ['DME_QLY', DME_QLY],
    ['RME_APP', RME_APP], ['RME_QLY', RME_QLY],
    ['SELECTED', SELECTED], ['MARKS', MARKS],
    ['ALLOC_POST', ALLOC_POST], ['ALLOC_STAT', ALLOC_STAT],
    ['ALLOC_AREA', ALLOC_AREA], ['RANK', RANK],
    ['WITHHELD', WITHHELD]
  ];

  statusFields.forEach(([field, value]) => {
    addCondition(field, value);
  });

  // ALLOC_CAT handling
  addCondition('ALLOC_CAT', ALLOC_CAT, (field, value, pCount) => {
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
*/

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
  console.log(filters);
  
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
        ORDER BY "${filters.orderBy || 'ROLL'}" ASC
      `,
      values: whereClause.values
    };

    console.log('Executing query:', {
      text: query.text,
      values: query.values
    });// Code Testing
    
    
    const queryStream = new QueryStream(query.text, query.values);
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
