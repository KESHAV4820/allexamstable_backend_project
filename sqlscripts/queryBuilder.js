'use strict';

const dotenv = require('dotenv');
dotenv.config({path:`${process.cwd()}/config.env`});// is recipe! not concept

const { Op } = require('sequelize');
//Issue FoundLOCKnowledge Gap Resolved const { allexamstableModel } = require('../db/models/allexamstablemodel'); // Assuming your models are in the 'db/models' directory
const allexamstableModel = require('../db/models/allexamstablemodel');//SuperConceptLearnByHeart this works but almost the same thing is written in LOC just above. It's becouse my sequelize doesn't export object which needs destructuring. It direct exports.

// Place the dynamic query building function here
//VIEConcept: latter on i introduced parameter like limit and offset. Why becouse earlier, the large size data was being retrieved using the query and it used to thrown heap out of memory problem. to solve that i had to do Pagination to break the output data into page and reduce the overhead. Later on, i shall "implement lazy loading" as well. limit=1000 tells the number of records to be fetched in each page. offset=0 say the starting page number will start from page number=0. 

//--------- TO GET ALL THE RECORDS OF QUERY RUNNING---------------------------------------
/*forced stop on 4/12/2024 Reason client parameter compatible function is made to replace it. 
const getRecordsByFilters = async (filters, limit=300, offset=0) => {
    const { EXAMNAME, REGID, ROLL, NAME, FATHERNAME, MOTHERNAME, DOB, GENDER, CAT1, CAT2, CAT3, WRTN1_APP, WRTN1_QLY, WRTN2_APP, WRTN2_QLY, WRTN3_APP, WRTN3_QLY, INTVW_APP, SKILL_APP, SKILL_QLY, PET_APP, PET_QLY, DME_APP, DME_QLY, RME_APP, RME_QLY, SELECTED, MARKS, ALLOC_POST, ALLOC_STAT, ALLOC_AREA, ALLOC_CAT, RANK, WITHHELD } = filters;
    //SuperNotethis here is the most important thing.here i am 
    //destructuring the input from filters that contains the input parameters. based on destructuring some will get value and some will not. And based on that, down below👇 we are making filters. Here is the punch line. since i was trying to make a query which can take any provided condition, as many conditions as possible and together by And operator, i used all the field names present in my table. Now i can use any field inside the whereClause filters. 😎Baam.
    //
  const whereClause = {
    where: {
      [Op.and]: [
        filters.EXAMNAME !== undefined ? ((filters.EXAMNAME === "") ? { EXAMNAME: { [Op.eq]: null } } : (filters.EXAMNAME==="ALL EXAMs")?{EXAMNAME:{[Op.ne]:null}}: { EXAMNAME: filters.EXAMNAME }) : {},

        filters.REGID !== undefined ? (filters.REGID === "" ? { REGID: { [Op.ne]: null } } : { REGID: filters.REGID }) : {},
        filters.ROLL !== undefined ? (filters.ROLL === "" ? { ROLL: { [Op.ne]: null } } : { ROLL: filters.ROLL }) : {},
        filters.NAME !== undefined ? (filters.NAME === "" ? { NAME: { [Op.ne]: null } } : { NAME: filters.NAME }) : {},
        filters.FATHERNAME !== undefined ? (filters.FATHERNAME === "" ? { FATHERNAME: { [Op.ne]: null } } : { FATHERNAME: filters.FATHERNAME }) : {},
        filters.MOTHERNAME !== undefined ? (filters.MOTHERNAME === "" ? { MOTHERNAME: { [Op.ne]: null } } : { MOTHERNAME: filters.MOTHERNAME }) : {},
        filters.DOB !== undefined ? (filters.DOB === "" ? { DOB: { [Op.ne]: null } } : { DOB: filters.DOB }) : {},

        filters.GENDER !== undefined ? ((filters.GENDER === "") ? { GENDER: { [Op.eq]: null } } :(filters.GENDER==="OVERALL")?{GENDER:{[Op.ne]:null}}:(filters.GENDER !== "OTHERS" ? {GENDER:filters.GENDER} :{ GENDER:{ [Op.eq]: "T" }})) : {},//Note

        filters.CAT1 !== undefined ? ((filters.CAT1 === "") ? { CAT1: { [Op.eq]: null } } : (filters.CAT1 === "TOGETHER")?{CAT1:{[Op.ne]:null}}: { CAT1: filters.CAT1 }) : {},

        filters.CAT2 !== undefined ? ((filters.CAT2 === "" || filters.CAT2==="N") ? { CAT2: { [Op.eq]: null } } : { CAT2: filters.CAT2 }) : {},

        filters.CAT3 !== undefined ? (filters.CAT3 === "" ? { CAT3: { [Op.eq]: null } } :(filters.CAT3==="TOGETHER"?{CAT3: {[Op.ne]:null}}:{ CAT3: filters.CAT3 })): {},

        filters.WRTN1_APP !== undefined ? (filters.WRTN1_APP === "" ? { WRTN1_APP: { [Op.eq]: null } } : { WRTN1_APP: filters.WRTN1_APP }) : {},
        filters.WRTN1_QLY !== undefined ? (filters.WRTN1_QLY === "" ? { WRTN1_QLY: { [Op.eq]: null } } : { WRTN1_QLY: filters.WRTN1_QLY }) : {},
        filters.WRTN2_APP !== undefined ? (filters.WRTN2_APP === "" ? { WRTN2_APP: { [Op.eq]: null } } : { WRTN2_APP: filters.WRTN2_APP }) : {},
        filters.WRTN2_QLY !== undefined ? (filters.WRTN2_QLY === "" ? { WRTN2_QLY: { [Op.eq]: null } } : { WRTN2_QLY: filters.WRTN2_QLY }) : {},
        filters.WRTN3_APP !== undefined ? (filters.WRTN3_APP === "" ? { WRTN3_APP: { [Op.eq]: null } } : { WRTN3_APP: filters.WRTN3_APP }) : {},
        filters.WRTN3_QLY !== undefined ? (filters.WRTN3_QLY === "" ? { WRTN3_QLY: { [Op.eq]: null } } : { WRTN3_QLY: filters.WRTN3_QLY }) : {},
        filters.INTVW_APP !== undefined ? (filters.INTVW_APP === "" ? { INTVW_APP: { [Op.eq]: null } } : { INTVW_APP: filters.INTVW_APP }) : {},
        filters.SKILL_APP !== undefined ? (filters.SKILL_APP === "" ? { SKILL_APP: { [Op.eq]: null } } : { SKILL_APP: filters.SKILL_APP }) : {},
        filters.SKILL_QLY !== undefined ? (filters.SKILL_QLY === "" ? { SKILL_QLY: { [Op.eq]: null } } : { SKILL_QLY: filters.SKILL_QLY }) : {},
        filters.PET_APP !== undefined ? (filters.PET_APP === "" ? { PET_APP: { [Op.eq]: null } } : { PET_APP: filters.PET_APP }) : {},
        filters.PET_QLY !== undefined ? (filters.PET_QLY === "" ? { PET_QLY: { [Op.eq]: null } } : { PET_QLY: filters.PET_QLY }) : {},
        filters.DME_APP !== undefined ? (filters.DME_APP === "" ? { DME_APP: { [Op.eq]: null } } : { DME_APP: filters.DME_APP }) : {},
        filters.DME_QLY !== undefined ? (filters.DME_QLY === "" ? { DME_QLY: { [Op.eq]: null } } : { DME_QLY: filters.DME_QLY }) : {},
        filters.RME_APP !== undefined ? (filters.RME_APP === "" ? { RME_APP: { [Op.eq]: null } } : { RME_APP: filters.RME_APP }) : {},
        filters.RME_QLY !== undefined ? (filters.RME_QLY === "" ? { RME_QLY: { [Op.eq]: null } } : { RME_QLY: filters.RME_QLY }) : {},
        filters.SELECTED !== undefined ? (filters.SELECTED === "" ? { SELECTED: { [Op.eq]: null } } : { SELECTED: filters.SELECTED }) : {},
        filters.MARKS !== undefined ? (filters.MARKS === "" ? { MARKS: { [Op.eq]: null } } : { MARKS: filters.MARKS }) : {},
        filters.ALLOC_POST !== undefined ? (filters.ALLOC_POST === "" ? { ALLOC_POST: { [Op.eq]: null } } : { ALLOC_POST: filters.ALLOC_POST }) : {},
        filters.ALLOC_STAT !== undefined ? (filters.ALLOC_STAT === "" ? { ALLOC_STAT: { [Op.eq]: null } } : { ALLOC_STAT: filters.ALLOC_STAT }) : {},
        filters.ALLOC_AREA !== undefined ? (filters.ALLOC_AREA === "" ? { ALLOC_AREA: { [Op.eq]: null } } : { ALLOC_AREA: filters.ALLOC_AREA }) : {},

        filters.ALLOC_CAT !== undefined ? ((filters.ALLOC_CAT === "") ? ({ALLOC_CAT: { [Op.eq]: null } }):
    (filters.ALLOC_CAT === "ALL_TOGETHER")?{ ALLOC_CAT:{ [Op.ne]: null } }:
        (filters.ALLOC_CAT === "0")?({ ALLOC_CAT: { [Op.in]: ['0','3', '4', '5', '7', '8'] }}):
        (filters.ALLOC_CAT ==="1")?({ ALLOC_CAT: { [Op.in]: ['1','3', '4', '5', '7', '8'] }}):
        (filters.ALLOC_CAT === "2")?({ ALLOC_CAT: { [Op.in]: ['2','3', '4', '5', '7', '8'] }}):
        (filters.ALLOC_CAT === "6")?({ ALLOC_CAT: { [Op.in]: ['6','3', '4', '5', '7', '8'] }}):
        (filters.ALLOC_CAT ==="9")?({
            [Op.or]: [
                { ALLOC_CAT: '9' },
                {
                    [Op.and]: [
                        { ALLOC_CAT: { [Op.in]: ['3', '4', '5', '7', '8'] } },
                        { CAT1: '9' }
                    ]
                }
            ]
        }):
        { ALLOC_CAT: filters.ALLOC_CAT }):{},
        
      //  legacy code explicit readable form
      //       filters.ALLOC_CAT !== undefined 
      //         ? (
      //             (filters.ALLOC_CAT === "") 
      //                 ? ({ ALLOC_CAT: { [Op.eq]: null }}) 
      //                 : (
      //                     filters.ALLOC_CAT !== "ALL_TOGETHER"
      //                       ? { ALLOC_CAT: filters.ALLOC_CAT }
      //                         : { ALLOC_CAT: { [Op.ne]:null } }
      //                   )
      //           ) 
      //         : {}, 
        filters.RANK !== undefined ? (filters.RANK === "" ? { RANK: { [Op.eq]: null } } : { RANK: filters.RANK }) : {},
        filters.WITHHELD !== undefined ? (filters.WITHHELD === "" ? { WITHHELD: { [Op.eq]: null } } : { WITHHELD: filters.WITHHELD }) : {}
        // Add any other conditions here
      ],
    },
}; 

// SuperNoteThis is yet another important part. here i am defining the
 //"whereClause" which uses sequelize sementics to form query. Now what's special about this is that i am chekcing if the filters has some value for that columnname. if not, then it would assign empty {} to it which would essentially mean that this particular column name will not be considered while forming the query. If the column name isn't undefined ,that means it must have some value. now there is no other way to send the value "is not null" in filters so that we can form such query. To do this, we have used "" empty double quotes to convery the signal that we are actually saying sequelize to consider it as "null" value. Now moving forward, if the columnname variable in filters has a value, it could be something else as well. so we do the same thing, but using ternary operator.  
//

const records = await allexamstableModel.findAll({// here query is being made.
    ...whereClause,
     attributes: ['EXAMNAME', 'REGID', 'ROLL', 'NAME', 'FATHERNAME', 'MOTHERNAME', 'DOB', 'GENDER', 'CAT1', 'CAT2', 'CAT3', 'WRTN1_APP', 'WRTN1_QLY', 'WRTN2_APP', 'WRTN2_QLY', 'WRTN3_APP', 'WRTN3_QLY', 'INTVW_APP', 'SKILL_APP', 'SKILL_QLY', 'PET_APP', 'PET_QLY', 'DME_APP', 'DME_QLY', 'RME_APP', 'RME_QLY', 'SELECTED', 'MARKS', 'ALLOC_POST', 'ALLOC_STAT', 'ALLOC_AREA', 'ALLOC_CAT', 'RANK', 'WITHHELD'],
     //NoteSuperConceptRemember It: 2️⃣ point is the most important in this project structure. 1️⃣ point is general information.  
    //1️⃣ attributes: [], lets you get the output for on the column names that you have mentioned. Hence you may think that you need to write the names of all the attributes to get the output from all the columns when query is done. But sequelize is intelligent. If you simply omit the attributes:[], parameters it will simply mean that the output will be given for all the columns. No need to write all the column heads.
    //👉Take A Good LookSuper2️⃣ in our defined allexamstableModel structure inside allexamstablemodel.js we have explicity turned off the primary key parameter. And by default, sequelize tries to give a primary key field named 'id'. since we were not allowed to make any modification to your table, we chose to suppress this default column named 'id'. hence we named all the attribute names(column names of our table) excluding the 'id'. now since  we were not mentioning the attributes, it meant to sequelize that we are also considering 'id' in this case. hence we will have to mention the attribute names to carry out successful query. 
     //
     limit,
     offset,// to implement pagination
  });

  return records;
};
*/
////code in progress newly added4/12/2024
const getRecordsByFilters = async (filters, limit=300, offset=0, client=null) => {
  const { EXAMNAME, REGID, ROLL, NAME, FATHERNAME, MOTHERNAME, DOB, GENDER, CAT1, CAT2, CAT3, WRTN1_APP, WRTN1_QLY, WRTN2_APP, WRTN2_QLY, WRTN3_APP, WRTN3_QLY, INTVW_APP, SKILL_APP, SKILL_QLY, PET_APP, PET_QLY, DME_APP, DME_QLY, RME_APP, RME_QLY, SELECTED, MARKS, ALLOC_POST, ALLOC_STAT, ALLOC_AREA, ALLOC_CAT, RANK, WITHHELD } = filters;
  // console.log(filters);//Code Testing
  
  
const whereClause = {
  where: {
    [Op.and]: [
      filters.EXAMNAME !== undefined ? ((filters.EXAMNAME === "") ? { EXAMNAME: { [Op.eq]: null } } : (filters.EXAMNAME==="ALL EXAMs")?{EXAMNAME:{[Op.ne]:null}}: { EXAMNAME: filters.EXAMNAME }) : {},

      filters.REGID !== undefined ? (filters.REGID === "" ? { REGID: { [Op.ne]: null } } : { REGID: filters.REGID }) : {},
      filters.ROLL !== undefined ? (filters.ROLL === "" ? { ROLL: { [Op.ne]: null } } : { ROLL: filters.ROLL }) : {},
      filters.NAME !== undefined ? (filters.NAME === "" ? { NAME: { [Op.ne]: null } } : { NAME: filters.NAME }) : {},
      filters.FATHERNAME !== undefined ? (filters.FATHERNAME === "" ? { FATHERNAME: { [Op.ne]: null } } : { FATHERNAME: filters.FATHERNAME }) : {},
      filters.MOTHERNAME !== undefined ? (filters.MOTHERNAME === "" ? { MOTHERNAME: { [Op.ne]: null } } : { MOTHERNAME: filters.MOTHERNAME }) : {},
      filters.DOB !== undefined ? (filters.DOB === "" ? { DOB: { [Op.ne]: null } } : { DOB: filters.DOB }) : {},

      filters.GENDER !== undefined ? ((filters.GENDER === "") ? { GENDER: { [Op.eq]: null } } :(filters.GENDER==="OVERALL")?{GENDER:{[Op.ne]:null}}:(filters.GENDER !== "OTHERS" ? {GENDER:filters.GENDER} :{ GENDER:{ [Op.eq]: "T" }})) : {},//Note

      filters.CAT1 !== undefined ? ((filters.CAT1 === "") ? { CAT1: { [Op.eq]: null } } : (filters.CAT1 === "TOGETHER")?{CAT1:{[Op.ne]:null}}: { CAT1: filters.CAT1 }) : {},

      filters.CAT2 !== undefined ? ((filters.CAT2 === "" || filters.CAT2==="N") ? { CAT2: { [Op.eq]: null } } : { CAT2: filters.CAT2 }) : {},

      filters.CAT3 !== undefined ? (filters.CAT3 === "" ? { CAT3: { [Op.eq]: null } } :(filters.CAT3==="TOGETHER"?{CAT3: {[Op.ne]:null}}:{ CAT3: filters.CAT3 })): {},

      filters.WRTN1_APP !== undefined ? (filters.WRTN1_APP === "" ? { WRTN1_APP: { [Op.eq]: null } } : { WRTN1_APP: filters.WRTN1_APP }) : {},
      filters.WRTN1_QLY !== undefined ? (filters.WRTN1_QLY === "" ? { WRTN1_QLY: { [Op.eq]: null } } : { WRTN1_QLY: filters.WRTN1_QLY }) : {},
      filters.WRTN2_APP !== undefined ? (filters.WRTN2_APP === "" ? { WRTN2_APP: { [Op.eq]: null } } : { WRTN2_APP: filters.WRTN2_APP }) : {},
      filters.WRTN2_QLY !== undefined ? (filters.WRTN2_QLY === "" ? { WRTN2_QLY: { [Op.eq]: null } } : { WRTN2_QLY: filters.WRTN2_QLY }) : {},
      filters.WRTN3_APP !== undefined ? (filters.WRTN3_APP === "" ? { WRTN3_APP: { [Op.eq]: null } } : { WRTN3_APP: filters.WRTN3_APP }) : {},
      filters.WRTN3_QLY !== undefined ? (filters.WRTN3_QLY === "" ? { WRTN3_QLY: { [Op.eq]: null } } : { WRTN3_QLY: filters.WRTN3_QLY }) : {},
      filters.INTVW_APP !== undefined ? (filters.INTVW_APP === "" ? { INTVW_APP: { [Op.eq]: null } } : { INTVW_APP: filters.INTVW_APP }) : {},
      filters.SKILL_APP !== undefined ? (filters.SKILL_APP === "" ? { SKILL_APP: { [Op.eq]: null } } : { SKILL_APP: filters.SKILL_APP }) : {},
      filters.SKILL_QLY !== undefined ? (filters.SKILL_QLY === "" ? { SKILL_QLY: { [Op.eq]: null } } : { SKILL_QLY: filters.SKILL_QLY }) : {},
      filters.PET_APP !== undefined ? (filters.PET_APP === "" ? { PET_APP: { [Op.eq]: null } } : { PET_APP: filters.PET_APP }) : {},
      filters.PET_QLY !== undefined ? (filters.PET_QLY === "" ? { PET_QLY: { [Op.eq]: null } } : { PET_QLY: filters.PET_QLY }) : {},
      filters.DME_APP !== undefined ? (filters.DME_APP === "" ? { DME_APP: { [Op.eq]: null } } : { DME_APP: filters.DME_APP }) : {},
      filters.DME_QLY !== undefined ? (filters.DME_QLY === "" ? { DME_QLY: { [Op.eq]: null } } : { DME_QLY: filters.DME_QLY }) : {},
      filters.RME_APP !== undefined ? (filters.RME_APP === "" ? { RME_APP: { [Op.eq]: null } } : { RME_APP: filters.RME_APP }) : {},
      filters.RME_QLY !== undefined ? (filters.RME_QLY === "" ? { RME_QLY: { [Op.eq]: null } } : { RME_QLY: filters.RME_QLY }) : {},
      filters.SELECTED !== undefined ? (filters.SELECTED === "" ? { SELECTED: { [Op.eq]: null } } : { SELECTED: filters.SELECTED }) : {},
      filters.MARKS !== undefined ? (filters.MARKS === "" ? { MARKS: { [Op.eq]: null } } : { MARKS: filters.MARKS }) : {},
      filters.ALLOC_POST !== undefined ? (filters.ALLOC_POST === "" ? { ALLOC_POST: { [Op.eq]: null } } : { ALLOC_POST: filters.ALLOC_POST }) : {},
      filters.ALLOC_STAT !== undefined ? (filters.ALLOC_STAT === "" ? { ALLOC_STAT: { [Op.eq]: null } } : { ALLOC_STAT: filters.ALLOC_STAT }) : {},
      filters.ALLOC_AREA !== undefined ? (filters.ALLOC_AREA === "" ? { ALLOC_AREA: { [Op.eq]: null } } : { ALLOC_AREA: filters.ALLOC_AREA }) : {},

      filters.ALLOC_CAT !== undefined ? ((filters.ALLOC_CAT === "") ? ({ALLOC_CAT: { [Op.eq]: null } }):
  (filters.ALLOC_CAT === "ALL_TOGETHER")?{ ALLOC_CAT:{ [Op.ne]: null } }:
      (filters.ALLOC_CAT === "0")?({ ALLOC_CAT: { [Op.in]: ['0','3', '4', '5', '7', '8'] }}):
      (filters.ALLOC_CAT ==="1")?({ ALLOC_CAT: { [Op.in]: ['1','3', '4', '5', '7', '8'] }}):
      (filters.ALLOC_CAT === "2")?({ ALLOC_CAT: { [Op.in]: ['2','3', '4', '5', '7', '8'] }}):
      (filters.ALLOC_CAT === "6")?({ ALLOC_CAT: { [Op.in]: ['6','3', '4', '5', '7', '8'] }}):
      (filters.ALLOC_CAT ==="9")?({
          [Op.or]: [
              { ALLOC_CAT: '9' },
              {
                  [Op.and]: [
                      { ALLOC_CAT: { [Op.in]: ['3', '4', '5', '7', '8'] } },
                      { CAT1: '9' }
                  ]
              }
          ]
      }):
      { ALLOC_CAT: filters.ALLOC_CAT }):{},
      filters.RANK !== undefined ? (filters.RANK === "" ? { RANK: { [Op.eq]: null } } : { RANK: filters.RANK }) : {},
      filters.WITHHELD !== undefined ? (filters.WITHHELD === "" ? { WITHHELD: { [Op.eq]: null } } : { WITHHELD: filters.WITHHELD }) : {}
      // Add any other conditions here
    ],
  },
};

//code in progress👇🏼
// if no client is provided, using the sequlize model
if (!client || !client.findAll) {
  const records = await allexamstableModel.findAll({
    ...whereClause,
    attributes:[
      'EXAMNAME', 'REGID', 'ROLL', 'NAME', 'FATHERNAME', 'MOTHERNAME', 
      'DOB', 'GENDER', 'CAT1', 'CAT2', 'CAT3', 'WRTN1_APP', 'WRTN1_QLY', 
      'WRTN2_APP', 'WRTN2_QLY', 'WRTN3_APP', 'WRTN3_QLY', 'INTVW_APP', 
      'SKILL_APP', 'SKILL_QLY', 'PET_APP', 'PET_QLY', 'DME_APP', 'DME_QLY', 
      'RME_APP', 'RME_QLY', 'SELECTED', 'MARKS', 'ALLOC_POST', 'ALLOC_STAT', 
      'ALLOC_AREA', 'ALLOC_CAT', 'RANK', 'WITHHELD'
      ],
    limit, 
    offset 
  });
}
// If a client is provided, but client.findAll() isn't working, then we use allexamstableModel
if (client && !client.findAll) {
 const records = await allexamstableModel.findAll({// Bug client.findAll() is a function for Sequalize, not native Postgres. This is causing trouble.
    ...whereClause,
    attributes: [
        'EXAMNAME', 'REGID', 'ROLL', 'NAME', 'FATHERNAME', 'MOTHERNAME', 
        'DOB', 'GENDER', 'CAT1', 'CAT2', 'CAT3', 'WRTN1_APP', 'WRTN1_QLY', 
        'WRTN2_APP', 'WRTN2_QLY', 'WRTN3_APP', 'WRTN3_QLY', 'INTVW_APP', 
        'SKILL_APP', 'SKILL_QLY', 'PET_APP', 'PET_QLY', 'DME_APP', 'DME_QLY', 
        'RME_APP', 'RME_QLY', 'SELECTED', 'MARKS', 'ALLOC_POST', 'ALLOC_STAT', 
        'ALLOC_AREA', 'ALLOC_CAT', 'RANK', 'WITHHELD'
        ],
        limit,
        offset
    });
  return records;
}

// if it is possible that client is a Sequelize model, then we use this client.
// const records = await client.findAll({
// ...whereClause,
// attributes: [
//     'EXAMNAME', 'REGID', 'ROLL', 'NAME', 'FATHERNAME', 'MOTHERNAME', 
//     'DOB', 'GENDER', 'CAT1', 'CAT2', 'CAT3', 'WRTN1_APP', 'WRTN1_QLY', 
//     'WRTN2_APP', 'WRTN2_QLY', 'WRTN3_APP', 'WRTN3_QLY', 'INTVW_APP', 
//     'SKILL_APP', 'SKILL_QLY', 'PET_APP', 'PET_QLY', 'DME_APP', 'DME_QLY', 
//     'RME_APP', 'RME_QLY', 'SELECTED', 'MARKS', 'ALLOC_POST', 'ALLOC_STAT', 
//     'ALLOC_AREA', 'ALLOC_CAT', 'RANK', 'WITHHELD'
//         ],
//         limit,
//         offset,
//     });
//   return records;
};
//

//Another Query
// ------- TO GET NUMBER OF RECORDS IN QUERY------------------------------------------
/*forced stop on 4/12/2024 Reason client parameter compatible function to replace
const getRecordsCountByFilters = async (filters) => {
    const { EXAMNAME, REGID, ROLL, NAME, FATHERNAME, MOTHERNAME, DOB, GENDER, CAT1, CAT2, CAT3, WRTN1_APP, WRTN1_QLY, WRTN2_APP, WRTN2_QLY, WRTN3_APP, WRTN3_QLY, INTVW_APP, SKILL_APP, SKILL_QLY, PET_APP, PET_QLY, DME_APP, DME_QLY, RME_APP, RME_QLY, SELECTED, MARKS, ALLOC_POST, ALLOC_STAT, ALLOC_AREA, ALLOC_CAT, RANK, WITHHELD } = filters;


  const whereClause = {
    where: {
      [Op.and]: [

        filters.EXAMNAME !== undefined ? ((filters.EXAMNAME === "") ? { EXAMNAME: { [Op.eq]: null } } : (filters.EXAMNAME==="ALL EXAMs")?{EXAMNAME:{[Op.ne]:null}}: { EXAMNAME: filters.EXAMNAME }) : {},

        filters.REGID !== undefined ? (filters.REGID === "" ? { REGID: { [Op.ne]: null } } : { REGID: filters.REGID }) : {},
        filters.ROLL !== undefined ? (filters.ROLL === "" ? { ROLL: { [Op.ne]: null } } : { ROLL: filters.ROLL }) : {},
        filters.NAME !== undefined ? (filters.NAME === "" ? { NAME: { [Op.ne]: null } } : { NAME: filters.NAME }) : {},
        filters.FATHERNAME !== undefined ? (filters.FATHERNAME === "" ? { FATHERNAME: { [Op.ne]: null } } : { FATHERNAME: filters.FATHERNAME }) : {},
        filters.MOTHERNAME !== undefined ? (filters.MOTHERNAME === "" ? { MOTHERNAME: { [Op.ne]: null } } : { MOTHERNAME: filters.MOTHERNAME }) : {},
        filters.DOB !== undefined ? (filters.DOB === "" ? { DOB: { [Op.ne]: null } } : { DOB: filters.DOB }) : {},

        filters.GENDER !== undefined ? ((filters.GENDER === "") ? { GENDER: { [Op.eq]: null } } :(filters.GENDER==="OVERALL")?{GENDER:{[Op.ne]:null}}:(filters.GENDER !== "OTHERS" ? {GENDER:filters.GENDER} :{ GENDER:{ [Op.eq]: "T" }})) : {},

        filters.CAT1 !== undefined ? ((filters.CAT1 === "") ? { CAT1: { [Op.eq]: null } } : (filters.CAT1 === "TOGETHER")?{CAT1:{[Op.ne]:null}}: { CAT1: filters.CAT1 }) : {},

        filters.CAT2 !== undefined ? ((filters.CAT2 === "" || filters.CAT2==="N") ? { CAT2: { [Op.eq]: null } } : { CAT2: filters.CAT2 }) : {},

        filters.CAT3 !== undefined ? (filters.CAT3 === "" ? { CAT3: { [Op.eq]: null } } :(filters.CAT3==="TOGETHER"?{CAT3: {[Op.ne]:null}}:{ CAT3: filters.CAT3 })): {},

        filters.WRTN1_APP !== undefined ? (filters.WRTN1_APP === "" ? { WRTN1_APP: { [Op.eq]: null } } : { WRTN1_APP: filters.WRTN1_APP }) : {},
        filters.WRTN1_QLY !== undefined ? (filters.WRTN1_QLY === "" ? { WRTN1_QLY: { [Op.eq]: null } } : { WRTN1_QLY: filters.WRTN1_QLY }) : {},
        filters.WRTN2_APP !== undefined ? (filters.WRTN2_APP === "" ? { WRTN2_APP: { [Op.eq]: null } } : { WRTN2_APP: filters.WRTN2_APP }) : {},
        filters.WRTN2_QLY !== undefined ? (filters.WRTN2_QLY === "" ? { WRTN2_QLY: { [Op.eq]: null } } : { WRTN2_QLY: filters.WRTN2_QLY }) : {},
        filters.WRTN3_APP !== undefined ? (filters.WRTN3_APP === "" ? { WRTN3_APP: { [Op.eq]: null } } : { WRTN3_APP: filters.WRTN3_APP }) : {},
        filters.WRTN3_QLY !== undefined ? (filters.WRTN3_QLY === "" ? { WRTN3_QLY: { [Op.eq]: null } } : { WRTN3_QLY: filters.WRTN3_QLY }) : {},
        filters.INTVW_APP !== undefined ? (filters.INTVW_APP === "" ? { INTVW_APP: { [Op.eq]: null } } : { INTVW_APP: filters.INTVW_APP }) : {},
        filters.SKILL_APP !== undefined ? (filters.SKILL_APP === "" ? { SKILL_APP: { [Op.eq]: null } } : { SKILL_APP: filters.SKILL_APP }) : {},
        filters.SKILL_QLY !== undefined ? (filters.SKILL_QLY === "" ? { SKILL_QLY: { [Op.eq]: null } } : { SKILL_QLY: filters.SKILL_QLY }) : {},
        filters.PET_APP !== undefined ? (filters.PET_APP === "" ? { PET_APP: { [Op.eq]: null } } : { PET_APP: filters.PET_APP }) : {},
        filters.PET_QLY !== undefined ? (filters.PET_QLY === "" ? { PET_QLY: { [Op.eq]: null } } : { PET_QLY: filters.PET_QLY }) : {},
        filters.DME_APP !== undefined ? (filters.DME_APP === "" ? { DME_APP: { [Op.eq]: null } } : { DME_APP: filters.DME_APP }) : {},
        filters.DME_QLY !== undefined ? (filters.DME_QLY === "" ? { DME_QLY: { [Op.eq]: null } } : { DME_QLY: filters.DME_QLY }) : {},
        filters.RME_APP !== undefined ? (filters.RME_APP === "" ? { RME_APP: { [Op.eq]: null } } : { RME_APP: filters.RME_APP }) : {},
        filters.RME_QLY !== undefined ? (filters.RME_QLY === "" ? { RME_QLY: { [Op.eq]: null } } : { RME_QLY: filters.RME_QLY }) : {},
        filters.SELECTED !== undefined ? (filters.SELECTED === "" ? { SELECTED: { [Op.eq]: null } } : { SELECTED: filters.SELECTED }) : {},
        filters.MARKS !== undefined ? (filters.MARKS === "" ? { MARKS: { [Op.eq]: null } } : { MARKS: filters.MARKS }) : {},
        filters.ALLOC_POST !== undefined ? (filters.ALLOC_POST === "" ? { ALLOC_POST: { [Op.eq]: null } } : { ALLOC_POST: filters.ALLOC_POST }) : {},
        filters.ALLOC_STAT !== undefined ? (filters.ALLOC_STAT === "" ? { ALLOC_STAT: { [Op.eq]: null } } : { ALLOC_STAT: filters.ALLOC_STAT }) : {},
        filters.ALLOC_AREA !== undefined ? (filters.ALLOC_AREA === "" ? { ALLOC_AREA: { [Op.eq]: null } } : { ALLOC_AREA: filters.ALLOC_AREA }) : {},

        
        // filters.ALLOC_CAT !== undefined ? ((filters.ALLOC_CAT === "") ? { ALLOC_CAT: { [Op.eq]: null } } : (filters.ALLOC_CAT === "ALL_TOGETHER")?{ ALLOC_CAT: { [Op.ne]: null } }: { ALLOC_CAT: filters.ALLOC_CAT }): {},
        filters.ALLOC_CAT !== undefined ? ((filters.ALLOC_CAT === "") ? ({ALLOC_CAT: { [Op.eq]: null } }):
    (filters.ALLOC_CAT === "ALL_TOGETHER")?{ ALLOC_CAT:{ [Op.ne]: null } }:
        (filters.ALLOC_CAT === "0")?({ ALLOC_CAT: { [Op.in]: ['0','3', '4', '5', '7', '8'] }}):
        (filters.ALLOC_CAT ==="1")?({ ALLOC_CAT: { [Op.in]: ['1','3', '4', '5', '7', '8'] }}):
        (filters.ALLOC_CAT === "2")?({ ALLOC_CAT: { [Op.in]: ['2','3', '4', '5', '7', '8'] }}):
        (filters.ALLOC_CAT === "6")?({ ALLOC_CAT: { [Op.in]: ['6','3', '4', '5', '7', '8'] }}):
        (filters.ALLOC_CAT ==="9")?({
            [Op.or]: [
                { ALLOC_CAT: '9' },
                {
                    [Op.and]: [
                        { ALLOC_CAT: { [Op.in]: ['3', '4', '5', '7', '8'] } },
                        { CAT1: '9' }
                    ]
                }
            ]
        }):
        { ALLOC_CAT: filters.ALLOC_CAT }):{},
        

        filters.RANK !== undefined ? (filters.RANK === "" ? { RANK: { [Op.eq]: null } } : { RANK: filters.RANK }) : {},
        filters.WITHHELD !== undefined ? (filters.WITHHELD === "" ? { WITHHELD: { [Op.eq]: null } } : { WITHHELD: filters.WITHHELD }) : {}


            //code upgrade👆
            // filters.EXAMNAME ? { 'EXAMNAME': filters.EXAMNAME } : {},
            // filters.REGID ? { 'REGID': filters.REGID } : {},
            // filters.ROLL ? { 'ROLL': filters.ROLL } : {},
            // filters.NAME ? { 'NAME': filters.NAME } : {},
            // filters.FATHERNAME ? { 'FATHERNAME': filters.FATHERNAME } : {},
            // filters.MOTHERNAME ? { 'MOTHERNAME': filters.MOTHERNAME } : {},
            // filters.DOB ? { 'DOB': filters.DOB } : {},
            // filters.GENDER ? { 'GENDER': filters.GENDER } : {},
            // filters.CAT1 ? { 'CAT1': filters.CAT1 } : {},
            // filters.CAT2 ? { 'CAT2': filters.CAT2 } : {},
            // filters.CAT3 ? { 'CAT3': filters.CAT3 } : {},
            // filters.WRTN1_APP ? { 'WRTN1_APP': filters.WRTN1_APP } : {},
            // filters.WRTN1_QLY ? { 'WRTN1_QLY': filters.WRTN1_QLY } : {},
            // filters.WRTN2_APP ? { 'WRTN2_APP': filters.WRTN2_APP } : {},
            // filters.WRTN2_QLY ? { 'WRTN2_QLY': filters.WRTN2_QLY } : {},
            // filters.WRTN3_APP ? { 'WRTN3_APP': filters.WRTN3_APP } : {},
            // filters.WRTN3_QLY ? { 'WRTN3_QLY': filters.WRTN3_QLY } : {},
            // filters.INTVW_APP ? { 'INTVW_APP': filters.INTVW_APP } : {},
            // filters.SKILL_APP ? { 'SKILL_APP': filters.SKILL_APP } : {},
            // filters.SKILL_QLY ? { 'SKILL_QLY': filters.SKILL_QLY } : {},
            // filters.PET_APP ? { 'PET_APP': filters.PET_APP } : {},
            // filters.PET_QLY ? { 'PET_QLY': filters.PET_QLY } : {},
            // filters.DME_APP ? { 'DME_APP': filters.DME_APP } : {},
            // filters.DME_QLY ? { 'DME_QLY': filters.DME_QLY } : {},
            // filters.RME_APP ? { 'RME_APP': filters.RME_APP } : {},
            // filters.RME_QLY ? { 'RME_QLY': filters.RME_QLY } : {},
            // filters.SELECTED ? { 'SELECTED': filters.SELECTED } : {},
            // filters.MARKS ? { 'MARKS': filters.MARKS } : {},
            // filters.ALLOC_POST ? { 'ALLOC_POST': filters.ALLOC_POST } : {},
            // filters.ALLOC_STAT ? { 'ALLOC_STAT': filters.ALLOC_STAT } : {},
            // filters.ALLOC_AREA ? { 'ALLOC_AREA': filters.ALLOC_AREA } : {},
            // filters.ALLOC_CAT ? { 'ALLOC_CAT': filters.ALLOC_CAT } : {},
            // filters.RANK ? { 'RANK': filters.RANK } : {},
            // filters.WITHHELD ? { 'WITHHELD': filters.WITHHELD } : {}
            //
            
      ],
    },
};
    const count=await allexamstableModel.count({
        ...whereClause,
    });
  return count;
};
*/
//code in progress newly added 4/12/2024
const getRecordsCountByFilters = async (filters, client=null) => {
  const { EXAMNAME, REGID, ROLL, NAME, FATHERNAME, MOTHERNAME, DOB, GENDER, CAT1, CAT2, CAT3, WRTN1_APP, WRTN1_QLY, WRTN2_APP, WRTN2_QLY, WRTN3_APP, WRTN3_QLY, INTVW_APP, SKILL_APP, SKILL_QLY, PET_APP, PET_QLY, DME_APP, DME_QLY, RME_APP, RME_QLY, SELECTED, MARKS, ALLOC_POST, ALLOC_STAT, ALLOC_AREA, ALLOC_CAT, RANK, WITHHELD } = filters;


const whereClause = {
  where: {
    [Op.and]: [

      filters.EXAMNAME !== undefined ? ((filters.EXAMNAME === "") ? { EXAMNAME: { [Op.eq]: null } } : (filters.EXAMNAME==="ALL EXAMs")?{EXAMNAME:{[Op.ne]:null}}: { EXAMNAME: filters.EXAMNAME }) : {},

      filters.REGID !== undefined ? (filters.REGID === "" ? { REGID: { [Op.ne]: null } } : { REGID: filters.REGID }) : {},
      filters.ROLL !== undefined ? (filters.ROLL === "" ? { ROLL: { [Op.ne]: null } } : { ROLL: filters.ROLL }) : {},
      filters.NAME !== undefined ? (filters.NAME === "" ? { NAME: { [Op.ne]: null } } : { NAME: filters.NAME }) : {},
      filters.FATHERNAME !== undefined ? (filters.FATHERNAME === "" ? { FATHERNAME: { [Op.ne]: null } } : { FATHERNAME: filters.FATHERNAME }) : {},
      filters.MOTHERNAME !== undefined ? (filters.MOTHERNAME === "" ? { MOTHERNAME: { [Op.ne]: null } } : { MOTHERNAME: filters.MOTHERNAME }) : {},
      filters.DOB !== undefined ? (filters.DOB === "" ? { DOB: { [Op.ne]: null } } : { DOB: filters.DOB }) : {},

      filters.GENDER !== undefined ? ((filters.GENDER === "") ? { GENDER: { [Op.eq]: null } } :(filters.GENDER==="OVERALL")?{GENDER:{[Op.ne]:null}}:(filters.GENDER !== "OTHERS" ? {GENDER:filters.GENDER} :{ GENDER:{ [Op.eq]: "T" }})) : {},

      filters.CAT1 !== undefined ? ((filters.CAT1 === "") ? { CAT1: { [Op.eq]: null } } : (filters.CAT1 === "TOGETHER")?{CAT1:{[Op.ne]:null}}: { CAT1: filters.CAT1 }) : {},

      filters.CAT2 !== undefined ? ((filters.CAT2 === "" || filters.CAT2==="N") ? { CAT2: { [Op.eq]: null } } : { CAT2: filters.CAT2 }) : {},

      filters.CAT3 !== undefined ? (filters.CAT3 === "" ? { CAT3: { [Op.eq]: null } } :(filters.CAT3==="TOGETHER"?{CAT3: {[Op.ne]:null}}:{ CAT3: filters.CAT3 })): {},

      filters.WRTN1_APP !== undefined ? (filters.WRTN1_APP === "" ? { WRTN1_APP: { [Op.eq]: null } } : { WRTN1_APP: filters.WRTN1_APP }) : {},
      filters.WRTN1_QLY !== undefined ? (filters.WRTN1_QLY === "" ? { WRTN1_QLY: { [Op.eq]: null } } : { WRTN1_QLY: filters.WRTN1_QLY }) : {},
      filters.WRTN2_APP !== undefined ? (filters.WRTN2_APP === "" ? { WRTN2_APP: { [Op.eq]: null } } : { WRTN2_APP: filters.WRTN2_APP }) : {},
      filters.WRTN2_QLY !== undefined ? (filters.WRTN2_QLY === "" ? { WRTN2_QLY: { [Op.eq]: null } } : { WRTN2_QLY: filters.WRTN2_QLY }) : {},
      filters.WRTN3_APP !== undefined ? (filters.WRTN3_APP === "" ? { WRTN3_APP: { [Op.eq]: null } } : { WRTN3_APP: filters.WRTN3_APP }) : {},
      filters.WRTN3_QLY !== undefined ? (filters.WRTN3_QLY === "" ? { WRTN3_QLY: { [Op.eq]: null } } : { WRTN3_QLY: filters.WRTN3_QLY }) : {},
      filters.INTVW_APP !== undefined ? (filters.INTVW_APP === "" ? { INTVW_APP: { [Op.eq]: null } } : { INTVW_APP: filters.INTVW_APP }) : {},
      filters.SKILL_APP !== undefined ? (filters.SKILL_APP === "" ? { SKILL_APP: { [Op.eq]: null } } : { SKILL_APP: filters.SKILL_APP }) : {},
      filters.SKILL_QLY !== undefined ? (filters.SKILL_QLY === "" ? { SKILL_QLY: { [Op.eq]: null } } : { SKILL_QLY: filters.SKILL_QLY }) : {},
      filters.PET_APP !== undefined ? (filters.PET_APP === "" ? { PET_APP: { [Op.eq]: null } } : { PET_APP: filters.PET_APP }) : {},
      filters.PET_QLY !== undefined ? (filters.PET_QLY === "" ? { PET_QLY: { [Op.eq]: null } } : { PET_QLY: filters.PET_QLY }) : {},
      filters.DME_APP !== undefined ? (filters.DME_APP === "" ? { DME_APP: { [Op.eq]: null } } : { DME_APP: filters.DME_APP }) : {},
      filters.DME_QLY !== undefined ? (filters.DME_QLY === "" ? { DME_QLY: { [Op.eq]: null } } : { DME_QLY: filters.DME_QLY }) : {},
      filters.RME_APP !== undefined ? (filters.RME_APP === "" ? { RME_APP: { [Op.eq]: null } } : { RME_APP: filters.RME_APP }) : {},
      filters.RME_QLY !== undefined ? (filters.RME_QLY === "" ? { RME_QLY: { [Op.eq]: null } } : { RME_QLY: filters.RME_QLY }) : {},
      filters.SELECTED !== undefined ? (filters.SELECTED === "" ? { SELECTED: { [Op.eq]: null } } : { SELECTED: filters.SELECTED }) : {},
      filters.MARKS !== undefined ? (filters.MARKS === "" ? { MARKS: { [Op.eq]: null } } : { MARKS: filters.MARKS }) : {},
      filters.ALLOC_POST !== undefined ? (filters.ALLOC_POST === "" ? { ALLOC_POST: { [Op.eq]: null } } : { ALLOC_POST: filters.ALLOC_POST }) : {},
      filters.ALLOC_STAT !== undefined ? (filters.ALLOC_STAT === "" ? { ALLOC_STAT: { [Op.eq]: null } } : { ALLOC_STAT: filters.ALLOC_STAT }) : {},
      filters.ALLOC_AREA !== undefined ? (filters.ALLOC_AREA === "" ? { ALLOC_AREA: { [Op.eq]: null } } : { ALLOC_AREA: filters.ALLOC_AREA }) : {},

      
      // filters.ALLOC_CAT !== undefined ? ((filters.ALLOC_CAT === "") ? { ALLOC_CAT: { [Op.eq]: null } } : (filters.ALLOC_CAT === "ALL_TOGETHER")?{ ALLOC_CAT: { [Op.ne]: null } }: { ALLOC_CAT: filters.ALLOC_CAT }): {},
      filters.ALLOC_CAT !== undefined ? ((filters.ALLOC_CAT === "") ? ({ALLOC_CAT: { [Op.eq]: null } }):
  (filters.ALLOC_CAT === "ALL_TOGETHER")?{ ALLOC_CAT:{ [Op.ne]: null } }:
      (filters.ALLOC_CAT === "0")?({ ALLOC_CAT: { [Op.in]: ['0','3', '4', '5', '7', '8'] }}):
      (filters.ALLOC_CAT ==="1")?({ ALLOC_CAT: { [Op.in]: ['1','3', '4', '5', '7', '8'] }}):
      (filters.ALLOC_CAT === "2")?({ ALLOC_CAT: { [Op.in]: ['2','3', '4', '5', '7', '8'] }}):
      (filters.ALLOC_CAT === "6")?({ ALLOC_CAT: { [Op.in]: ['6','3', '4', '5', '7', '8'] }}):
      (filters.ALLOC_CAT ==="9")?({
          [Op.or]: [
              { ALLOC_CAT: '9' },
              {
                  [Op.and]: [
                      { ALLOC_CAT: { [Op.in]: ['3', '4', '5', '7', '8'] } },
                      { CAT1: '9' }
                  ]
              }
          ]
      }):
      { ALLOC_CAT: filters.ALLOC_CAT }):{},
      

      filters.RANK !== undefined ? (filters.RANK === "" ? { RANK: { [Op.eq]: null } } : { RANK: filters.RANK }) : {},
      filters.WITHHELD !== undefined ? (filters.WITHHELD === "" ? { WITHHELD: { [Op.eq]: null } } : { WITHHELD: filters.WITHHELD }) : {}
    ],
  },
};

// If a client is provided, use it for direct query
if (client) {
      return await client.count({// Bug since client.count() isn't a native function of postgres but sequlize ORM, it is not returning the value but the latter code👇🏼is😕
        ...whereClause,
      });
}

// Fallback to original Sequelize query if no client is provided
return await allexamstableModel.count({
...whereClause,
});
};


// -------------For DOWNLOADING THE QUERIES--------------------------------------------
const fs = require('fs');
const path = require('path');
const { Parser } = require('json2csv');
const archiver=require('archiver');
const os=require('os');

// forced stop on 4/12/2024 Reason client parameter compatible code to replace
const downloadRecord = async (filters) => {
  console.log(filters);//Code Testing
  
  const { EXAMNAME, REGID, ROLL, NAME, FATHERNAME, MOTHERNAME, DOB, GENDER, CAT1, CAT2, CAT3, WRTN1_APP, WRTN1_QLY, WRTN2_APP, WRTN2_QLY, WRTN3_APP, WRTN3_QLY, INTVW_APP, SKILL_APP, SKILL_QLY, PET_APP, PET_QLY, DME_APP, DME_QLY, RME_APP, RME_QLY, SELECTED, MARKS, ALLOC_POST, ALLOC_STAT, ALLOC_AREA, ALLOC_CAT, RANK, WITHHELD } = filters;
  console.log(filters);//Code Testing
  

const whereClause = {
    where: {
      [Op.and]: [
        filters.EXAMNAME !== undefined ? ((filters.EXAMNAME === "") ? { EXAMNAME: { [Op.eq]: null } } : (filters.EXAMNAME==="ALL EXAMs")?{EXAMNAME:{[Op.ne]:null}}: { EXAMNAME: filters.EXAMNAME }) : {},

        filters.REGID !== undefined ? (filters.REGID === "" ? { REGID: { [Op.ne]: null } } : { REGID: filters.REGID }) : {},
        filters.ROLL !== undefined ? (filters.ROLL === "" ? { ROLL: { [Op.ne]: null } } : { ROLL: filters.ROLL }) : {},
        filters.NAME !== undefined ? (filters.NAME === "" ? { NAME: { [Op.ne]: null } } : { NAME: filters.NAME }) : {},
        filters.FATHERNAME !== undefined ? (filters.FATHERNAME === "" ? { FATHERNAME: { [Op.ne]: null } } : { FATHERNAME: filters.FATHERNAME }) : {},
        filters.MOTHERNAME !== undefined ? (filters.MOTHERNAME === "" ? { MOTHERNAME: { [Op.ne]: null } } : { MOTHERNAME: filters.MOTHERNAME }) : {},
        filters.DOB !== undefined ? (filters.DOB === "" ? { DOB: { [Op.ne]: null } } : { DOB: filters.DOB }) : {},

        filters.GENDER !== undefined ? ((filters.GENDER === "") ? { GENDER: { [Op.eq]: null } } :(filters.GENDER==="OVERALL")?{GENDER:{[Op.ne]:null}}:(filters.GENDER !== "OTHERS" ? {GENDER:filters.GENDER} :{ GENDER:{ [Op.eq]: "T" }})) : {},

        filters.CAT1 !== undefined ? ((filters.CAT1 === "") ? { CAT1: { [Op.eq]: null } } : (filters.CAT1 === "TOGETHER")?{CAT1:{[Op.ne]:null}}: { CAT1: filters.CAT1 }) : {},

        filters.CAT2 !== undefined ? ((filters.CAT2 === "" || filters.CAT2==="N") ? { CAT2: { [Op.eq]: null } } : { CAT2: filters.CAT2 }) : {},

        filters.CAT3 !== undefined ? (filters.CAT3 === "" ? { CAT3: { [Op.eq]: null } } :(filters.CAT3==="TOGETHER"?{CAT3: {[Op.ne]:null}}:{ CAT3: filters.CAT3 })): {},

        filters.WRTN1_APP !== undefined ? (filters.WRTN1_APP === "" ? { WRTN1_APP: { [Op.eq]: null } } : { WRTN1_APP: filters.WRTN1_APP }) : {},
        filters.WRTN1_QLY !== undefined ? (filters.WRTN1_QLY === "" ? { WRTN1_QLY: { [Op.eq]: null } } : { WRTN1_QLY: filters.WRTN1_QLY }) : {},
        filters.WRTN2_APP !== undefined ? (filters.WRTN2_APP === "" ? { WRTN2_APP: { [Op.eq]: null } } : { WRTN2_APP: filters.WRTN2_APP }) : {},
        filters.WRTN2_QLY !== undefined ? (filters.WRTN2_QLY === "" ? { WRTN2_QLY: { [Op.eq]: null } } : { WRTN2_QLY: filters.WRTN2_QLY }) : {},
        filters.WRTN3_APP !== undefined ? (filters.WRTN3_APP === "" ? { WRTN3_APP: { [Op.eq]: null } } : { WRTN3_APP: filters.WRTN3_APP }) : {},
        filters.WRTN3_QLY !== undefined ? (filters.WRTN3_QLY === "" ? { WRTN3_QLY: { [Op.eq]: null } } : { WRTN3_QLY: filters.WRTN3_QLY }) : {},
        filters.INTVW_APP !== undefined ? (filters.INTVW_APP === "" ? { INTVW_APP: { [Op.eq]: null } } : { INTVW_APP: filters.INTVW_APP }) : {},
        filters.SKILL_APP !== undefined ? (filters.SKILL_APP === "" ? { SKILL_APP: { [Op.eq]: null } } : { SKILL_APP: filters.SKILL_APP }) : {},
        filters.SKILL_QLY !== undefined ? (filters.SKILL_QLY === "" ? { SKILL_QLY: { [Op.eq]: null } } : { SKILL_QLY: filters.SKILL_QLY }) : {},
        filters.PET_APP !== undefined ? (filters.PET_APP === "" ? { PET_APP: { [Op.eq]: null } } : { PET_APP: filters.PET_APP }) : {},
        filters.PET_QLY !== undefined ? (filters.PET_QLY === "" ? { PET_QLY: { [Op.eq]: null } } : { PET_QLY: filters.PET_QLY }) : {},
        filters.DME_APP !== undefined ? (filters.DME_APP === "" ? { DME_APP: { [Op.eq]: null } } : { DME_APP: filters.DME_APP }) : {},
        filters.DME_QLY !== undefined ? (filters.DME_QLY === "" ? { DME_QLY: { [Op.eq]: null } } : { DME_QLY: filters.DME_QLY }) : {},
        filters.RME_APP !== undefined ? (filters.RME_APP === "" ? { RME_APP: { [Op.eq]: null } } : { RME_APP: filters.RME_APP }) : {},
        filters.RME_QLY !== undefined ? (filters.RME_QLY === "" ? { RME_QLY: { [Op.eq]: null } } : { RME_QLY: filters.RME_QLY }) : {},
        filters.SELECTED !== undefined ? (filters.SELECTED === "" ? { SELECTED: { [Op.eq]: null } } : { SELECTED: filters.SELECTED }) : {},
        filters.MARKS !== undefined ? (filters.MARKS === "" ? { MARKS: { [Op.eq]: null } } : { MARKS: filters.MARKS }) : {},
        filters.ALLOC_POST !== undefined ? (filters.ALLOC_POST === "" ? { ALLOC_POST: { [Op.eq]: null } } : { ALLOC_POST: filters.ALLOC_POST }) : {},
        filters.ALLOC_STAT !== undefined ? (filters.ALLOC_STAT === "" ? { ALLOC_STAT: { [Op.eq]: null } } : { ALLOC_STAT: filters.ALLOC_STAT }) : {},
        filters.ALLOC_AREA !== undefined ? (filters.ALLOC_AREA === "" ? { ALLOC_AREA: { [Op.eq]: null } } : { ALLOC_AREA: filters.ALLOC_AREA }) : {},

        // filters.ALLOC_CAT !== undefined ? (filters.ALLOC_CAT === "" ? { ALLOC_CAT: { [Op.eq]: null } } : { ALLOC_CAT: filters.ALLOC_CAT }) : {},
        filters.ALLOC_CAT !== undefined ? ((filters.ALLOC_CAT === "") ? ({ALLOC_CAT: { [Op.eq]: null } }):
    (filters.ALLOC_CAT === "ALL_TOGETHER")?{ ALLOC_CAT:{ [Op.ne]: null } }:
        (filters.ALLOC_CAT === "0")?({ ALLOC_CAT: { [Op.in]: ['0','3', '4', '5', '7', '8'] }}):
        (filters.ALLOC_CAT ==="1")?({ ALLOC_CAT: { [Op.in]: ['1','3', '4', '5', '7', '8'] }}):
        (filters.ALLOC_CAT === "2")?({ ALLOC_CAT: { [Op.in]: ['2','3', '4', '5', '7', '8'] }}):
        (filters.ALLOC_CAT === "6")?({ ALLOC_CAT: { [Op.in]: ['6','3', '4', '5', '7', '8'] }}):
        (filters.ALLOC_CAT ==="9")?({
            [Op.or]: [
                { ALLOC_CAT: '9' },
                {
                    [Op.and]: [
                        { ALLOC_CAT: { [Op.in]: ['3', '4', '5', '7', '8'] } },
                        { CAT1: '9' }
                    ]
                }
            ]
        }):
        { ALLOC_CAT: filters.ALLOC_CAT }):{},

        filters.RANK !== undefined ? (filters.RANK === "" ? { RANK: { [Op.eq]: null } } : { RANK: filters.RANK }) : {},
        filters.WITHHELD !== undefined ? (filters.WITHHELD === "" ? { WITHHELD: { [Op.eq]: null } } : { WITHHELD: filters.WITHHELD }) : {}
      ],
    },
  };

  let records = [];
  let offset = process.env.DOWNLOAD_OFFSET|| 0;
  const limit = process.env.DOWNLOAD_LIMIT || 500000; // Limit to 5 lakh records per fetch
  const csvFileNames=[];

  while (true) {
    const fetchedRecords = await allexamstableModel.findAll({
      ...whereClause,
      attributes: ['EXAMNAME', 'REGID', 'ROLL', 'NAME', 'FATHERNAME', 'MOTHERNAME', 'DOB', 'GENDER', 'CAT1', 'CAT2', 'CAT3', 'WRTN1_APP', 'WRTN1_QLY', 'WRTN2_APP', 'WRTN2_QLY', 'WRTN3_APP', 'WRTN3_QLY', 'INTVW_APP', 'SKILL_APP', 'SKILL_QLY', 'PET_APP', 'PET_QLY', 'DME_APP', 'DME_QLY', 'RME_APP', 'RME_QLY', 'SELECTED', 'MARKS', 'ALLOC_POST', 'ALLOC_STAT', 'ALLOC_AREA', 'ALLOC_CAT', 'RANK', 'WITHHELD'],
      limit,
      offset,
    });

    if (fetchedRecords.length === 0) {
      break;
    }

    records = records.concat(fetchedRecords);
    offset += limit;

    if (records.length >= limit) {
      const fields = ['EXAMNAME', 'REGID', 'ROLL', 'NAME', 'FATHERNAME', 'MOTHERNAME', 'DOB', 'GENDER', 'CAT1', 'CAT2', 'CAT3', 'WRTN1_APP', 'WRTN1_QLY', 'WRTN2_APP', 'WRTN2_QLY', 'WRTN3_APP', 'WRTN3_QLY', 'INTVW_APP', 'SKILL_APP', 'SKILL_QLY', 'PET_APP', 'PET_QLY', 'DME_APP', 'DME_QLY', 'RME_APP', 'RME_QLY', 'SELECTED', 'MARKS', 'ALLOC_POST', 'ALLOC_STAT', 'ALLOC_AREA', 'ALLOC_CAT', 'RANK', 'WITHHELD'];
      const parser = new Parser({ fields });
      const csv = parser.parse(records);

      const fileNumber = Math.floor(offset / limit);
      const filePath = path.join(__dirname, `data_part_${fileNumber}.csv`);
      fs.writeFileSync(filePath, csv);
      csvFileNames.push(filePath);
      records = [];
    }
  }

  // trying to handle the remaining records
  if (records.length > 0) {
    const fields = ['EXAMNAME', 'REGID', 'ROLL', 'NAME', 'FATHERNAME', 'MOTHERNAME', 'DOB', 'GENDER', 'CAT1', 'CAT2', 'CAT3', 'WRTN1_APP', 'WRTN1_QLY', 'WRTN2_APP', 'WRTN2_QLY', 'WRTN3_APP', 'WRTN3_QLY', 'INTVW_APP', 'SKILL_APP', 'SKILL_QLY', 'PET_APP', 'PET_QLY', 'DME_APP', 'DME_QLY', 'RME_APP', 'RME_QLY', 'SELECTED', 'MARKS', 'ALLOC_POST', 'ALLOC_STAT', 'ALLOC_AREA', 'ALLOC_CAT', 'RANK', 'WITHHELD'];
    const parser = new Parser({ fields });
    const csv = parser.parse(records);
    const fileNumber = Math.floor(offset / limit); // Increment the file number
    const filePath = path.join(__dirname, `data_part_${fileNumber}.csv`);
    fs.writeFileSync(filePath, csv);
    csvFileNames.push(filePath);
  }
  // Now i will try the zipping it and downloading it.😵God Help
  return new Promise((resolve, reject) => {
    const zipFilePath = path.join(os.tmpdir(), `data_${Date.now()}.zip`);
    const archive = archiver('zip', { zlib: { level: 9 } });// Knowledge Gap: what's level: 9 😕
    const outputArea = fs.createWriteStream(zipFilePath);

    outputArea.on('close', () => {
      console.log(`Total file size of zipped folder is: ${archive.pointer()} bytes`);
      console.log('ZIP archive has been made and the outputArea file descriptor has been shutdown');

      // Cleaning up CSV files
      csvFileNames.forEach((file) => {
        fs.unlinkSync(file);
      });
      console.log('Removed all the temporary files generated in the process.');

      resolve(zipFilePath);
    });

    archive.on('error', (err) => {
      reject(err);
    });

    archive.pipe(outputArea);

    csvFileNames.forEach((file) => {
      archive.file(file, { name: path.basename(file) });
    });

    archive.finalize();
  });
};
//
/*code in progress newly added 4/12/2024 Note:this code isn't being implemented becouse didn't want to over do the download logic by implementing instant query abort system. Becouse i presume that once, you have come to the stage of downloading a data, you are sure about your intentions. Second thing: that this download logic works such that it downloaded zipped folder of chucks of file with 5 lakhs of data each, which are first downloaded and put into the project folder and then, from there, it is zipped and shipped to frontend for downloading purpose. So to implement IQAS, i will have to pick a fateful day and work on it.
const downloadRecord = async (filters, client=null) => {
  console.log(filters);//Code Testing
  
  const { EXAMNAME, REGID, ROLL, NAME, FATHERNAME, MOTHERNAME, DOB, GENDER, CAT1, CAT2, CAT3, WRTN1_APP, WRTN1_QLY, WRTN2_APP, WRTN2_QLY, WRTN3_APP, WRTN3_QLY, INTVW_APP, SKILL_APP, SKILL_QLY, PET_APP, PET_QLY, DME_APP, DME_QLY, RME_APP, RME_QLY, SELECTED, MARKS, ALLOC_POST, ALLOC_STAT, ALLOC_AREA, ALLOC_CAT, RANK, WITHHELD } = filters;
  console.log(filters);//Code Testing
  

const whereClause = {
    where: {
      [Op.and]: [
        filters.EXAMNAME !== undefined ? ((filters.EXAMNAME === "") ? { EXAMNAME: { [Op.eq]: null } } : (filters.EXAMNAME==="ALL EXAMs")?{EXAMNAME:{[Op.ne]:null}}: { EXAMNAME: filters.EXAMNAME }) : {},

        filters.REGID !== undefined ? (filters.REGID === "" ? { REGID: { [Op.ne]: null } } : { REGID: filters.REGID }) : {},
        filters.ROLL !== undefined ? (filters.ROLL === "" ? { ROLL: { [Op.ne]: null } } : { ROLL: filters.ROLL }) : {},
        filters.NAME !== undefined ? (filters.NAME === "" ? { NAME: { [Op.ne]: null } } : { NAME: filters.NAME }) : {},
        filters.FATHERNAME !== undefined ? (filters.FATHERNAME === "" ? { FATHERNAME: { [Op.ne]: null } } : { FATHERNAME: filters.FATHERNAME }) : {},
        filters.MOTHERNAME !== undefined ? (filters.MOTHERNAME === "" ? { MOTHERNAME: { [Op.ne]: null } } : { MOTHERNAME: filters.MOTHERNAME }) : {},
        filters.DOB !== undefined ? (filters.DOB === "" ? { DOB: { [Op.ne]: null } } : { DOB: filters.DOB }) : {},

        filters.GENDER !== undefined ? ((filters.GENDER === "") ? { GENDER: { [Op.eq]: null } } :(filters.GENDER==="OVERALL")?{GENDER:{[Op.ne]:null}}:(filters.GENDER !== "OTHERS" ? {GENDER:filters.GENDER} :{ GENDER:{ [Op.eq]: "T" }})) : {},

        filters.CAT1 !== undefined ? ((filters.CAT1 === "") ? { CAT1: { [Op.eq]: null } } : (filters.CAT1 === "TOGETHER")?{CAT1:{[Op.ne]:null}}: { CAT1: filters.CAT1 }) : {},

        filters.CAT2 !== undefined ? ((filters.CAT2 === "" || filters.CAT2==="N") ? { CAT2: { [Op.eq]: null } } : { CAT2: filters.CAT2 }) : {},

        filters.CAT3 !== undefined ? (filters.CAT3 === "" ? { CAT3: { [Op.eq]: null } } :(filters.CAT3==="TOGETHER"?{CAT3: {[Op.ne]:null}}:{ CAT3: filters.CAT3 })): {},

        filters.WRTN1_APP !== undefined ? (filters.WRTN1_APP === "" ? { WRTN1_APP: { [Op.eq]: null } } : { WRTN1_APP: filters.WRTN1_APP }) : {},
        filters.WRTN1_QLY !== undefined ? (filters.WRTN1_QLY === "" ? { WRTN1_QLY: { [Op.eq]: null } } : { WRTN1_QLY: filters.WRTN1_QLY }) : {},
        filters.WRTN2_APP !== undefined ? (filters.WRTN2_APP === "" ? { WRTN2_APP: { [Op.eq]: null } } : { WRTN2_APP: filters.WRTN2_APP }) : {},
        filters.WRTN2_QLY !== undefined ? (filters.WRTN2_QLY === "" ? { WRTN2_QLY: { [Op.eq]: null } } : { WRTN2_QLY: filters.WRTN2_QLY }) : {},
        filters.WRTN3_APP !== undefined ? (filters.WRTN3_APP === "" ? { WRTN3_APP: { [Op.eq]: null } } : { WRTN3_APP: filters.WRTN3_APP }) : {},
        filters.WRTN3_QLY !== undefined ? (filters.WRTN3_QLY === "" ? { WRTN3_QLY: { [Op.eq]: null } } : { WRTN3_QLY: filters.WRTN3_QLY }) : {},
        filters.INTVW_APP !== undefined ? (filters.INTVW_APP === "" ? { INTVW_APP: { [Op.eq]: null } } : { INTVW_APP: filters.INTVW_APP }) : {},
        filters.SKILL_APP !== undefined ? (filters.SKILL_APP === "" ? { SKILL_APP: { [Op.eq]: null } } : { SKILL_APP: filters.SKILL_APP }) : {},
        filters.SKILL_QLY !== undefined ? (filters.SKILL_QLY === "" ? { SKILL_QLY: { [Op.eq]: null } } : { SKILL_QLY: filters.SKILL_QLY }) : {},
        filters.PET_APP !== undefined ? (filters.PET_APP === "" ? { PET_APP: { [Op.eq]: null } } : { PET_APP: filters.PET_APP }) : {},
        filters.PET_QLY !== undefined ? (filters.PET_QLY === "" ? { PET_QLY: { [Op.eq]: null } } : { PET_QLY: filters.PET_QLY }) : {},
        filters.DME_APP !== undefined ? (filters.DME_APP === "" ? { DME_APP: { [Op.eq]: null } } : { DME_APP: filters.DME_APP }) : {},
        filters.DME_QLY !== undefined ? (filters.DME_QLY === "" ? { DME_QLY: { [Op.eq]: null } } : { DME_QLY: filters.DME_QLY }) : {},
        filters.RME_APP !== undefined ? (filters.RME_APP === "" ? { RME_APP: { [Op.eq]: null } } : { RME_APP: filters.RME_APP }) : {},
        filters.RME_QLY !== undefined ? (filters.RME_QLY === "" ? { RME_QLY: { [Op.eq]: null } } : { RME_QLY: filters.RME_QLY }) : {},
        filters.SELECTED !== undefined ? (filters.SELECTED === "" ? { SELECTED: { [Op.eq]: null } } : { SELECTED: filters.SELECTED }) : {},
        filters.MARKS !== undefined ? (filters.MARKS === "" ? { MARKS: { [Op.eq]: null } } : { MARKS: filters.MARKS }) : {},
        filters.ALLOC_POST !== undefined ? (filters.ALLOC_POST === "" ? { ALLOC_POST: { [Op.eq]: null } } : { ALLOC_POST: filters.ALLOC_POST }) : {},
        filters.ALLOC_STAT !== undefined ? (filters.ALLOC_STAT === "" ? { ALLOC_STAT: { [Op.eq]: null } } : { ALLOC_STAT: filters.ALLOC_STAT }) : {},
        filters.ALLOC_AREA !== undefined ? (filters.ALLOC_AREA === "" ? { ALLOC_AREA: { [Op.eq]: null } } : { ALLOC_AREA: filters.ALLOC_AREA }) : {},

        // filters.ALLOC_CAT !== undefined ? (filters.ALLOC_CAT === "" ? { ALLOC_CAT: { [Op.eq]: null } } : { ALLOC_CAT: filters.ALLOC_CAT }) : {},
        filters.ALLOC_CAT !== undefined ? ((filters.ALLOC_CAT === "") ? ({ALLOC_CAT: { [Op.eq]: null } }):
    (filters.ALLOC_CAT === "ALL_TOGETHER")?{ ALLOC_CAT:{ [Op.ne]: null } }:
        (filters.ALLOC_CAT === "0")?({ ALLOC_CAT: { [Op.in]: ['0','3', '4', '5', '7', '8'] }}):
        (filters.ALLOC_CAT ==="1")?({ ALLOC_CAT: { [Op.in]: ['1','3', '4', '5', '7', '8'] }}):
        (filters.ALLOC_CAT === "2")?({ ALLOC_CAT: { [Op.in]: ['2','3', '4', '5', '7', '8'] }}):
        (filters.ALLOC_CAT === "6")?({ ALLOC_CAT: { [Op.in]: ['6','3', '4', '5', '7', '8'] }}):
        (filters.ALLOC_CAT ==="9")?({
            [Op.or]: [
                { ALLOC_CAT: '9' },
                {
                    [Op.and]: [
                        { ALLOC_CAT: { [Op.in]: ['3', '4', '5', '7', '8'] } },
                        { CAT1: '9' }
                    ]
                }
            ]
        }):
        { ALLOC_CAT: filters.ALLOC_CAT }):{},

        filters.RANK !== undefined ? (filters.RANK === "" ? { RANK: { [Op.eq]: null } } : { RANK: filters.RANK }) : {},
        filters.WITHHELD !== undefined ? (filters.WITHHELD === "" ? { WITHHELD: { [Op.eq]: null } } : { WITHHELD: filters.WITHHELD }) : {}
      ],
    },
  };

  let records = [];
  let offset = process.env.DOWNLOAD_OFFSET|| 0;
  const limit = process.env.DOWNLOAD_LIMIT || 500000; // Limit to 5 lakh records per fetch
  const csvFileNames=[];

  const modelToUse = client || allexamstableModel;

  while (true) {
    const fetchedRecords = await modelToUse.findAll({
      ...whereClause,
      attributes: ['EXAMNAME', 'REGID', 'ROLL', 'NAME', 'FATHERNAME', 'MOTHERNAME', 'DOB', 'GENDER', 'CAT1', 'CAT2', 'CAT3', 'WRTN1_APP', 'WRTN1_QLY', 'WRTN2_APP', 'WRTN2_QLY', 'WRTN3_APP', 'WRTN3_QLY', 'INTVW_APP', 'SKILL_APP', 'SKILL_QLY', 'PET_APP', 'PET_QLY', 'DME_APP', 'DME_QLY', 'RME_APP', 'RME_QLY', 'SELECTED', 'MARKS', 'ALLOC_POST', 'ALLOC_STAT', 'ALLOC_AREA', 'ALLOC_CAT', 'RANK', 'WITHHELD'],
      limit,
      offset,
    });

    if (fetchedRecords.length === 0) {
      break;
    }

    records = records.concat(fetchedRecords);
    offset += limit;

    if (records.length >= limit) {
      const fields = ['EXAMNAME', 'REGID', 'ROLL', 'NAME', 'FATHERNAME', 'MOTHERNAME', 'DOB', 'GENDER', 'CAT1', 'CAT2', 'CAT3', 'WRTN1_APP', 'WRTN1_QLY', 'WRTN2_APP', 'WRTN2_QLY', 'WRTN3_APP', 'WRTN3_QLY', 'INTVW_APP', 'SKILL_APP', 'SKILL_QLY', 'PET_APP', 'PET_QLY', 'DME_APP', 'DME_QLY', 'RME_APP', 'RME_QLY', 'SELECTED', 'MARKS', 'ALLOC_POST', 'ALLOC_STAT', 'ALLOC_AREA', 'ALLOC_CAT', 'RANK', 'WITHHELD'];
      const parser = new Parser({ fields });
      const csv = parser.parse(records);

      const fileNumber = Math.floor(offset / limit);
      const filePath = path.join(__dirname, `data_part_${fileNumber}.csv`);
      fs.writeFileSync(filePath, csv);
      csvFileNames.push(filePath);
      records = [];
    }
  }

  // trying to handle the remaining records
  if (records.length > 0) {
    const fields = ['EXAMNAME', 'REGID', 'ROLL', 'NAME', 'FATHERNAME', 'MOTHERNAME', 'DOB', 'GENDER', 'CAT1', 'CAT2', 'CAT3', 'WRTN1_APP', 'WRTN1_QLY', 'WRTN2_APP', 'WRTN2_QLY', 'WRTN3_APP', 'WRTN3_QLY', 'INTVW_APP', 'SKILL_APP', 'SKILL_QLY', 'PET_APP', 'PET_QLY', 'DME_APP', 'DME_QLY', 'RME_APP', 'RME_QLY', 'SELECTED', 'MARKS', 'ALLOC_POST', 'ALLOC_STAT', 'ALLOC_AREA', 'ALLOC_CAT', 'RANK', 'WITHHELD'];
    const parser = new Parser({ fields });
    const csv = parser.parse(records);
    const fileNumber = Math.floor(offset / limit); // Increment the file number
    const filePath = path.join(__dirname, `data_part_${fileNumber}.csv`);
    fs.writeFileSync(filePath, csv);
    csvFileNames.push(filePath);
  }
  // Now i will try the zipping it and downloading it.😵God Help
  return new Promise((resolve, reject) => {
    const zipFilePath = path.join(os.tmpdir(), `data_${Date.now()}.zip`);
    const archive = archiver('zip', { zlib: { level: 6 } });// Knowledge Gap: what's level: 9 Resolved: level:9 is compression level of the data. 9 is the highest compression level, least size, but most time taking. lowest is level: 1. biggest size but takes least time. optimal is level: 6👍🏼
    const outputArea = fs.createWriteStream(zipFilePath);

    outputArea.on('close', () => {
      console.log(`Total file size of zipped folder is: ${archive.pointer()} bytes`);
      console.log('ZIP archive has been made and the outputArea file descriptor has been shutdown');

      // Cleaning up CSV files
      csvFileNames.forEach((file) => {
        fs.unlinkSync(file);
      });
      console.log('Removed all the temporary files generated in the process.');

      resolve(zipFilePath);
    });

    archive.on('error', (err) => {
      reject(err);
    });

    archive.pipe(outputArea);

    csvFileNames.forEach((file) => {
      archive.file(file, { name: path.basename(file) });
    });

    archive.finalize();
  });
};
*/

//--------EXPORTING----------------------------------------------------------------

    module.exports = {
    getRecordsByFilters,
    getRecordsCountByFilters,
    downloadRecord
};