'use strict';


// const dotenv = require('dotenv');
// dotenv.config({path:`${process.cwd()}/config.env`});//is recipe! not concept these two lines now gives eyes to our rest of code to see what's present in config.env file.😎🙏
// const limit = req.query.limit || 1000;
// const offset=req.query.offset || 0;

const {getRecordsByFilters}=require('./../sqlscripts/queryBuilder');

/*legacy code Issue Found this code would need 72 database calls each time ok will be clicked. this will be heavy on database and network. Hence i didn't even mold this code to suit my need. I simply deed the analysis and abandoned the code. AI can beat Human mind. But not Today. 😎
async function calculateAllStats(baseFilters) {
    const stats = {
      total: {},
      gender: {},
      category: {},
      esm: {},
      pwd: {}
    };
  
    // Total candidates
    stats.total.all = await getRecordsCountByFilters(baseFilters);
  
    // Gender breakdown
    stats.gender.male = await getRecordsCountByFilters({...baseFilters, GENDER: 'M'});
    stats.gender.female = await getRecordsCountByFilters({...baseFilters, GENDER: 'F'});
  
    // Category breakdown
    stats.category.gen = await getRecordsCountByFilters({...baseFilters, ALLOC_CAT: '0'});
    stats.category.sc = await getRecordsCountByFilters({...baseFilters, ALLOC_CAT: '1'});
    stats.category.st = await getRecordsCountByFilters({...baseFilters, ALLOC_CAT: '2'});
    stats.category.obc = await getRecordsCountByFilters({...baseFilters, ALLOC_CAT: '6'});
    stats.category.ews = await getRecordsCountByFilters({...baseFilters, ALLOC_CAT: '9'});
  
    // ESM breakdown
    stats.esm.total = await getRecordsCountByFilters({...baseFilters, CAT2: 'E'});
    stats.esm.male = await getRecordsCountByFilters({...baseFilters, CAT2: 'E', GENDER: 'M'});
    stats.esm.female = await getRecordsCountByFilters({...baseFilters, CAT2: 'E', GENDER: 'F'});
  
    // PWD breakdown
    stats.pwd.total = await getRecordsCountByFilters({...baseFilters, CAT3: {[Op.ne]: null}});
    stats.pwd.male = await getRecordsCountByFilters({...baseFilters, CAT3: {[Op.ne]: null}, GENDER: 'M'});
    stats.pwd.female = await getRecordsCountByFilters({...baseFilters, CAT3: {[Op.ne]: null}, GENDER: 'F'});
  
    // PWD subcategories
    stats.pwd.oh = await getRecordsCountByFilters({...baseFilters, CAT3: 'O'});
    stats.pwd.hh = await getRecordsCountByFilters({...baseFilters, CAT3: 'H'});
    stats.pwd.vh = await getRecordsCountByFilters({...baseFilters, CAT3: 'V'});
  
    return stats;
  }

module.exports={
    statsCalculator
};

*/
//code upgrade code in progress

// Function to initialize the stats object
function initializeStatsObject() {
    return {
      examname:'EXAM NAME',
      candidates: { total: 0, gen: 0, sc: 0, st: 0, obc: 0, ews: 0 },
      candidates_per: { total: 0, gen: 0, sc: 0, st: 0, obc: 0, ews: 0 },//for saving percentage values after calculation.
      male: {total: 0, gen: 0, sc: 0, st: 0, obc: 0, ews: 0},
      male_per:{ total: 0, gen: 0, sc: 0, st: 0, obc: 0, ews: 0 },
      female: {total: 0, gen: 0, sc: 0, st: 0, obc: 0, ews: 0},
      female_per:{ total: 0, gen: 0, sc: 0, st: 0, obc: 0, ews: 0 },
      esm_candidates: {total: 0, gen: 0, sc: 0, st: 0, obc: 0, ews: 0},
      esm_candidates_per: { total: 0, gen: 0, sc: 0, st: 0, obc: 0, ews: 0 },
      esm_male: {total: 0, gen: 0, sc: 0, st: 0, obc: 0, ews: 0},
      esm_male_per: { total: 0, gen: 0, sc: 0, st: 0, obc: 0, ews: 0 },
      esm_female: {total: 0, gen: 0, sc: 0, st: 0, obc: 0, ews: 0},
      esm_female_per: { total: 0, gen: 0, sc: 0, st: 0, obc: 0, ews: 0 },
      oh_candidates: {total: 0, gen: 0, sc: 0, st: 0, obc: 0, ews: 0},
      oh_candidates_per: { total: 0, gen: 0, sc: 0, st: 0, obc: 0, ews: 0 },
      oh_male: {total: 0, gen: 0, sc: 0, st: 0, obc: 0, ews: 0},
      oh_male_per: { total: 0, gen: 0, sc: 0, st: 0, obc: 0, ews: 0 },
      oh_female: {total: 0, gen: 0, sc: 0, st: 0, obc: 0, ews: 0},
      oh_female_per: { total: 0, gen: 0, sc: 0, st: 0, obc: 0, ews: 0 },
      hh_candidates: {total: 0, gen: 0, sc: 0, st: 0, obc: 0, ews: 0},
      hh_candidates_per: { total: 0, gen: 0, sc: 0, st: 0, obc: 0, ews: 0 },
      hh_male: {total: 0, gen: 0, sc: 0, st: 0, obc: 0, ews: 0},
      hh_male_per: { total: 0, gen: 0, sc: 0, st: 0, obc: 0, ews: 0 },
      hh_female: {total: 0, gen: 0, sc: 0, st: 0, obc: 0, ews: 0},
      hh_female_per: { total: 0, gen: 0, sc: 0, st: 0, obc: 0, ews: 0 },
      vh_candidates: {total: 0, gen: 0, sc: 0, st: 0, obc: 0, ews: 0},
      vh_candidates_per: { total: 0, gen: 0, sc: 0, st: 0, obc: 0, ews: 0 },
      vh_male: {total: 0, gen: 0, sc: 0, st: 0, obc: 0, ews: 0},
      vh_male_per: { total: 0, gen: 0, sc: 0, st: 0, obc: 0, ews: 0 },
      vh_female: {total: 0, gen: 0, sc: 0, st: 0, obc: 0, ews: 0},
      vh_female_per: { total: 0, gen: 0, sc: 0, st: 0, obc: 0, ews: 0 },
      pwd_candidates: {total: 0, gen: 0, sc: 0, st: 0, obc: 0, ews: 0},
      pwd_candidates_per: { total: 0, gen: 0, sc: 0, st: 0, obc: 0, ews: 0 },
      pwd_male: {total: 0, gen: 0, sc: 0, st: 0, obc: 0, ews: 0},
      pwd_male_per: { total: 0, gen: 0, sc: 0, st: 0, obc: 0, ews: 0 },
      pwd_female: {total: 0, gen: 0, sc: 0, st: 0, obc: 0, ews: 0},
      pwd_female_per: { total: 0, gen: 0, sc: 0, st: 0, obc: 0, ews: 0 },
    };
  };
  
  // Function to update stats based on a single record generated in every for loop
  function updateStats(stats, record) {

    // Helper function to update category counts
    function updateCategoryCounts(obj) {
        
            // for overall consideration.
                obj.candidates.total++;
                switch(record.CAT1) {
                case '0': obj.candidates.ews++; break;
                case '1': obj.candidates.sc++; break;
                case '2': obj.candidates.st++; break;
                case '6': obj.candidates.obc++; break;
                case '9': obj.candidates.gen++; break;
                };
            // Update gender-specific counts
                if (record.GENDER === 'M') {
                    obj.male.total++;
                    switch(record.CAT1) {
                        case '0': obj.male.ews++; break;
                        case '1': obj.male.sc++; break;
                        case '2': obj.male.st++; break;
                        case '6': obj.male.obc++; break;
                        case '9': obj.male.gen++; break;
                    };
                };
                if (record.GENDER === 'F') {
                    obj.female.total++;
                    switch(record.CAT1) {
                        case '0': obj.female.ews++; break;
                        case '1': obj.female.sc++; break;
                        case '2': obj.female.st++; break;
                        case '6': obj.female.obc++; break;
                        case '9': obj.female.gen++; break;
                    };
                };

                // for ESM candidates
                if(record.CAT2 === '3'){
                    obj.esm_candidates.total++;
                    switch(record.CAT1) {// becouse the ALLOC_CAT is already known. Becouse it's horizontal reservation. To know vertical, we use CAT1
                        case '0': obj.esm_candidates.ews++; break;
                        case '1': obj.esm_candidates.sc++; break;
                        case '2': obj.esm_candidates.st++; break;
                        case '6': obj.esm_candidates.obc++; break;
                        case '9': obj.esm_candidates.gen++; break;
                    };
                };
                if (record.CAT2 === '3' && record.GENDER === 'M') {
                    obj.esm_male.total++;
                    switch(record.CAT1) {
                        case '0': obj.esm_male.ews++; break;
                        case '1': obj.esm_male.sc++; break;
                        case '2': obj.esm_male.st++; break;
                        case '6': obj.esm_male.obc++; break;
                        case '9': obj.esm_male.gen++; break;
                    };
                };
                if (record.CAT2 === '3' && record.GENDER === 'F') {
                    obj.esm_female.total++;
                    switch(record.CAT1) {
                        case '0': obj.esm_female.ews++; break;
                        case '1': obj.esm_female.sc++; break;
                        case '2': obj.esm_female.st++; break;
                        case '6': obj.esm_female.obc++; break;
                        case '9': obj.esm_female.gen++; break;
                    };    
                };

                //for OH candidates
                if(record.CAT3 === '4'){
                    obj.oh_candidates.total++;
                    switch(record.CAT1) {
                        case '0': obj.oh_candidates.ews++; break;
                        case '1': obj.oh_candidates.sc++; break;
                        case '2': obj.oh_candidates.st++; break;
                        case '6': obj.oh_candidates.obc++; break;
                        case '9': obj.oh_candidates.gen++; break;
                    };
                };
                if (record.CAT3 === '4' && record.GENDER === 'M') {
                    obj.oh_male.total++;
                    switch(record.CAT1) {
                        case '0': obj.oh_male.ews++; break;
                        case '1': obj.oh_male.sc++; break;
                        case '2': obj.oh_male.st++; break;
                        case '6': obj.oh_male.obc++; break;
                        case '9': obj.oh_male.gen++; break;
                    };
                };
                if (record.CAT3 === '4' && record.GENDER === 'F') {
                    obj.oh_female.total++;
                    switch(record.CAT1) {
                        case '0': obj.oh_female.ews++; break;
                        case '1': obj.oh_female.sc++; break;
                        case '2': obj.oh_female.st++; break;
                        case '6': obj.oh_female.obc++; break;
                        case '9': obj.oh_female.gen++; break;
                    };    
                };

                //for HH handicapped candidates
                if(record.CAT3 === '5'){
                    obj.hh_candidates.total++;
                    switch(record.CAT1) {
                        case '0': obj.hh_candidates.ews++; break;
                        case '1': obj.hh_candidates.sc++; break;
                        case '2': obj.hh_candidates.st++; break;
                        case '6': obj.hh_candidates.obc++; break;
                        case '9': obj.hh_candidates.gen++; break;
                    };
                };
                if (record.CAT3 === '5' && record.GENDER === 'M') {
                    obj.hh_male.total++;
                    switch(record.CAT1) {
                        case '0': obj.hh_male.ews++; break;
                        case '1': obj.hh_male.sc++; break;
                        case '2': obj.hh_male.st++; break;
                        case '6': obj.hh_male.obc++; break;
                        case '9': obj.hh_male.gen++; break;
                    };
                };
                if (record.CAT3 === '5' && record.GENDER === 'F') {
                    obj.hh_female.total++;
                    switch(record.CAT1) {
                        case '0': obj.hh_female.ews++; break;
                        case '1': obj.hh_female.sc++; break;
                        case '2': obj.hh_female.st++; break;
                        case '6': obj.hh_female.obc++; break;
                        case '9': obj.hh_female.gen++; break;
                    };    
                };

                //for VH handicapped candidates
                if(record.CAT3 === '7'){
                    obj.vh_candidates.total++;
                    switch(record.CAT1) {
                        case '0': obj.vh_candidates.ews++; break;
                        case '1': obj.vh_candidates.sc++; break;
                        case '2': obj.vh_candidates.st++; break;
                        case '6': obj.vh_candidates.obc++; break;
                        case '9': obj.vh_candidates.gen++; break;
                    };
                };
                if (record.CAT3 === '7' && record.GENDER === 'M') {
                    obj.vh_male.total++;
                    switch(record.CAT1) {
                        case '0': obj.vh_male.ews++; break;
                        case '1': obj.vh_male.sc++; break;
                        case '2': obj.vh_male.st++; break;
                        case '6': obj.vh_male.obc++; break;
                        case '9': obj.vh_male.gen++; break;
                    };
                };
                if (record.CAT3 === '7' && record.GENDER === 'F') {
                    obj.vh_female.total++;
                    switch(record.CAT1) {
                        case '0': obj.vh_female.ews++; break;
                        case '1': obj.vh_female.sc++; break;
                        case '2': obj.vh_female.st++; break;
                        case '6': obj.vh_female.obc++; break;
                        case '9': obj.vh_female.gen++; break;
                    };    
                };

                //for PWD handicapped candidates
                if(record.CAT3 === '8'){
                    obj.pwd_candidates.total++;
                    switch(record.CAT1) {
                        case '0': obj.pwd_candidates.ews++; break;
                        case '1': obj.pwd_candidates.sc++; break;
                        case '2': obj.pwd_candidates.st++; break;
                        case '6': obj.pwd_candidates.obc++; break;
                        case '9': obj.pwd_candidates.gen++; break;
                    };
                };
                if (record.CAT3 === '8' && record.GENDER === 'M') {
                    obj.pwd_male.total++;
                    switch(record.CAT1) {
                        case '0': obj.pwd_male.ews++; break;
                        case '1': obj.pwd_male.sc++; break;
                        case '2': obj.pwd_male.st++; break;
                        case '6': obj.pwd_male.obc++; break;
                        case '9': obj.pwd_male.gen++; break;
                    };
                };
                if (record.CAT3 === '8' && record.GENDER === 'F') {
                    obj.pwd_female.total++;
                    switch(record.CAT1) {
                        case '0': obj.pwd_female.ews++; break;
                        case '1': obj.pwd_female.sc++; break;
                        case '2': obj.pwd_female.st++; break;
                        case '6': obj.pwd_female.obc++; break;
                        case '9': obj.pwd_female.gen++; break;
                    };    
                };


    };
    // Update total candidate count
    updateCategoryCounts(stats);//calling the function rightaway to use the concept of IIFy . Instantly Invoked Funtiony.
};
  
  // Main function to calculate all stats
  async function calculateAllStats(baseFilters, limit=316000, offset=0) {
    // Get EXAMNAME if it exists or put default"NAME N/A"
    const examName = baseFilters.EXAMNAME || "NAME N/A";

    // Fetch all relevant records in one query
    const records = await getRecordsByFilters(baseFilters,limit,offset);//Issue Found
    const stats = initializeStatsObject();
    stats.examname=examName;
  
    // Process each record
    for (const record of records) {
      updateStats(stats, record);
    };
    // percentage wise calculation
    //for General consideration.
    {
        stats.candidates_per.total = (stats.candidates.total/stats.candidates.total)*100;
        stats.candidates_per.ews = (stats.candidates.ews/stats.candidates.total)*100;
        stats.candidates_per.sc = (stats.candidates.sc/stats.candidates.total)*100;
        stats.candidates_per.st = (stats.candidates.st/stats.candidates.total)*100;
        stats.candidates_per.obc = (stats.candidates.obc/stats.candidates.total)*100;
        stats.candidates_per.gen = (stats.candidates.gen/stats.candidates.total)*100;

        stats.male_per.total = (stats.male.total/stats.candidates.total)*100;
        stats.male_per.ews = (stats.male.ews/stats.candidates.total)*100;
        stats.male_per.sc = (stats.male.sc/stats.candidates.total)*100;
        stats.male_per.st = (stats.male.st/stats.candidates.total)*100;
        stats.male_per.obc = (stats.male.obc/stats.candidates.total)*100
        stats.male_per.gen = (stats.male.gen/stats.candidates.total)*100;

        stats.female_per.total = (stats.female.total/stats.candidates.total)*100;
        stats.female_per.ews = (stats.female.ews/stats.candidates.total)*100;
        stats.female_per.sc = (stats.female.sc/stats.candidates.total)*100;
        stats.female_per.st = (stats.female.st/stats.candidates.total)*100;
        stats.female_per.obc = (stats.female.obc/stats.candidates.total)*100
        stats.female_per.gen = (stats.female.gen/stats.candidates.total)*100;
    }
 // for ESM candidates %
    {
        stats.esm_candidates_per.total = (stats.esm_candidates.total/stats.candidates.total)*100;
        stats.esm_candidates_per.ews = (stats.esm_candidates.ews/stats.candidates.total)*100;
        stats.esm_candidates_per.sc = (stats.esm_candidates.sc/stats.candidates.total)*100;
        stats.esm_candidates_per.st = (stats.esm_candidates.st/stats.candidates.total)*100;
        stats.esm_candidates_per.obc = (stats.esm_candidates.obc/stats.candidates.total)*100;
        stats.esm_candidates_per.gen = (stats.esm_candidates.gen/stats.candidates.total)*100;

        stats.esm_male_per.total = (stats.esm_male.total/stats.candidates.total)*100;
        stats.esm_male_per.ews = (stats.esm_male.ews/stats.candidates.total)*100;
        stats.esm_male_per.sc = (stats.esm_male.sc/stats.candidates.total)*100;
        stats.esm_male_per.st = (stats.esm_male.st/stats.candidates.total)*100;
        stats.esm_male_per.obc = (stats.esm_male.obc/stats.candidates.total)*100;
        stats.esm_male_per.gen = (stats.esm_male.gen/stats.candidates.total)*100;

        stats.esm_female_per.total = (stats.esm_female.total/stats.candidates.total)*100;
        stats.esm_female_per.ews = (stats.esm_female.ews/stats.candidates.total)*100;
        stats.esm_female_per.sc = (stats.esm_female.sc/stats.candidates.total)*100;
        stats.esm_female_per.st = (stats.esm_female.st/stats.candidates.total)*100;
        stats.esm_female_per.obc = (stats.esm_female.obc/stats.candidates.total)*100;
        stats.esm_female_per.gen = (stats.esm_female.gen/stats.candidates.total)*100;
    }
 // for OH candidate %
    {
        stats.oh_candidates_per.total = (stats.oh_candidates.total/stats.candidates.total)*100;
        stats.oh_candidates_per.ews = (stats.oh_candidates.ews/stats.candidates.total)*100;
        stats.oh_candidates_per.sc = (stats.oh_candidates.sc/stats.candidates.total)*100;
        stats.oh_candidates_per.st = (stats.oh_candidates.st/stats.candidates.total)*100;
        stats.oh_candidates_per.obc = (stats.oh_candidates.obc/stats.candidates.total)*100;
        stats.oh_candidates_per.gen = (stats.oh_candidates.gen/stats.candidates.total)*100;

        stats.oh_male_per.total = (stats.oh_male.total/stats.candidates.total)*100;
        stats.oh_male_per.ews = (stats.oh_male.ews/stats.candidates.total)*100;
        stats.oh_male_per.sc = (stats.oh_male.sc/stats.candidates.total)*100;
        stats.oh_male_per.st = (stats.oh_male.st/stats.candidates.total)*100;
        stats.oh_male_per.obc = (stats.oh_male.obc/stats.candidates.total)*100;
        stats.oh_male_per.gen = (stats.oh_male.gen/stats.candidates.total)*100;

        stats.oh_female_per.total = (stats.oh_female.total/stats.candidates.total)*100;
        stats.oh_female_per.ews = (stats.oh_female.ews/stats.candidates.total)*100;
        stats.oh_female_per.sc = (stats.oh_female.sc/stats.candidates.total)*100;
        stats.oh_female_per.st = (stats.oh_female.st/stats.candidates.total)*100;
        stats.oh_female_per.obc = (stats.oh_female.obc/stats.candidates.total)*100;
        stats.oh_female_per.gen = (stats.oh_female.gen/stats.candidates.total)*100;
    }
 // for HH candidate %
    {
        stats.hh_candidates_per.total = (stats.hh_candidates.total/stats.candidates.total)*100;
        stats.hh_candidates_per.ews = (stats.hh_candidates.ews/stats.candidates.total)*100;
        stats.hh_candidates_per.sc = (stats.hh_candidates.sc/stats.candidates.total)*100;
        stats.hh_candidates_per.st = (stats.hh_candidates.st/stats.candidates.total)*100;
        stats.hh_candidates_per.obc = (stats.hh_candidates.obc/stats.candidates.total)*100;
        stats.hh_candidates_per.gen = (stats.hh_candidates.gen/stats.candidates.total)*100;

        stats.hh_male_per.total = (stats.hh_male.total/stats.candidates.total)*100;
        stats.hh_male_per.ews = (stats.hh_male.ews/stats.candidates.total)*100;
        stats.hh_male_per.sc = (stats.hh_male.sc/stats.candidates.total)*100;
        stats.hh_male_per.st = (stats.hh_male.st/stats.candidates.total)*100;
        stats.hh_male_per.obc = (stats.hh_male.obc/stats.candidates.total)*100;
        stats.hh_male_per.gen = (stats.hh_male.gen/stats.candidates.total)*100;

        stats.hh_female_per.total = (stats.hh_female.total/stats.candidates.total)*100;
        stats.hh_female_per.ews = (stats.hh_female.ews/stats.candidates.total)*100;
        stats.hh_female_per.sc = (stats.hh_female.sc/stats.candidates.total)*100;
        stats.hh_female_per.st = (stats.hh_female.st/stats.candidates.total)*100;
        stats.hh_female_per.obc = (stats.hh_female.obc/stats.candidates.total)*100;
        stats.hh_female_per.gen = (stats.hh_female.gen/stats.candidates.total)*100;
    }
 // for VH candidate %
    {
        stats.vh_candidates_per.total = (stats.vh_candidates.total/stats.candidates.total)*100;
        stats.vh_candidates_per.ews = (stats.vh_candidates.ews/stats.candidates.total)*100;
        stats.vh_candidates_per.sc = (stats.vh_candidates.sc/stats.candidates.total)*100;
        stats.vh_candidates_per.st = (stats.vh_candidates.st/stats.candidates.total)*100;
        stats.vh_candidates_per.obc = (stats.vh_candidates.obc/stats.candidates.total)*100;
        stats.vh_candidates_per.gen = (stats.vh_candidates.gen/stats.candidates.total)*100;

        stats.vh_male_per.total = (stats.vh_male.total/stats.candidates.total)*100;
        stats.vh_male_per.ews = (stats.vh_male.ews/stats.candidates.total)*100;
        stats.vh_male_per.sc = (stats.vh_male.sc/stats.candidates.total)*100;
        stats.vh_male_per.st = (stats.vh_male.st/stats.candidates.total)*100;
        stats.vh_male_per.obc = (stats.vh_male.obc/stats.candidates.total)*100;
        stats.vh_male_per.gen = (stats.vh_male.gen/stats.candidates.total)*100;

        stats.vh_female_per.total = (stats.vh_female.total/stats.candidates.total)*100;
        stats.vh_female_per.ews = (stats.vh_female.ews/stats.candidates.total)*100;
        stats.vh_female_per.sc = (stats.vh_female.sc/stats.candidates.total)*100;
        stats.vh_female_per.st = (stats.vh_female.st/stats.candidates.total)*100;
        stats.vh_female_per.obc = (stats.vh_female.obc/stats.candidates.total)*100;
        stats.vh_female_per.gen = (stats.vh_female.gen/stats.candidates.total)*100;
    }
 // for PWD candidate %
    {
        stats.pwd_candidates_per.total = (stats.pwd_candidates.total/stats.candidates.total)*100;
        stats.pwd_candidates_per.ews = (stats.pwd_candidates.ews/stats.candidates.total)*100;
        stats.pwd_candidates_per.sc = (stats.pwd_candidates.sc/stats.candidates.total)*100;
        stats.pwd_candidates_per.st = (stats.pwd_candidates.st/stats.candidates.total)*100;
        stats.pwd_candidates_per.obc = (stats.pwd_candidates.obc/stats.candidates.total)*100;
        stats.pwd_candidates_per.gen = (stats.pwd_candidates.gen/stats.candidates.total)*100;

        stats.pwd_male_per.total = (stats.pwd_male.total/stats.candidates.total)*100;
        stats.pwd_male_per.ews = (stats.pwd_male.ews/stats.candidates.total)*100;
        stats.pwd_male_per.sc = (stats.pwd_male.sc/stats.candidates.total)*100;
        stats.pwd_male_per.st = (stats.pwd_male.st/stats.candidates.total)*100;
        stats.pwd_male_per.obc = (stats.pwd_male.obc/stats.candidates.total)*100;
        stats.pwd_male_per.gen = (stats.pwd_male.gen/stats.candidates.total)*100;

        stats.pwd_female_per.total = (stats.pwd_female.total/stats.candidates.total)*100;
        stats.pwd_female_per.ews = (stats.pwd_female.ews/stats.candidates.total)*100;
        stats.pwd_female_per.sc = (stats.pwd_female.sc/stats.candidates.total)*100;
        stats.pwd_female_per.st = (stats.pwd_female.st/stats.candidates.total)*100;
        stats.pwd_female_per.obc = (stats.pwd_female.obc/stats.candidates.total)*100;
        stats.pwd_female_per.gen = (stats.pwd_female.gen/stats.candidates.total)*100;
    }

    return stats;
  };
  
  
  
  // Export the functions
  module.exports = {
    calculateAllStats,
  };
