const { Op } = require('sequelize');
//Issue FoundLOCKnowledge Gapconst { allexamstableModel } = require('../db/models/allexamstablemodel'); // Assuming your models are in the 'db/models' directory
const allexamstableModel = require('../db/models/allexamstablemodel');//SuperConceptLearnByHeart

// Place the dynamic query building function here
//VIEConcept: latter on i introduced parameter like limit and offset. Why becouse earlier, the large size data was being retrieved using the query and it used to thrown heap out of memory problem. to solve that i had to do Pagination to break the output data into page and reduce the overhead. Later on, i shall "implement lazy loading" as well. limit=1000 tells the number of records to be fetched in each page. offset=0 say the starting page number will start from page number=0. 
const getRecordsByFilters = async (filters, limit=1000, offset=0) => {
    const { EXAMNAME, REGID, ROLL, NAME, FATHERNAME, MOTHERNAME, DOB, GENDER, CAT1, CAT2, CAT3, WRTN1_APP, WRTN1_QLY, WRTN2_APP, WRTN2_QLY, WRTN3_APP, WRTN3_QLY, INTVW_APP, SKILL_APP, SKILL_QLY, PET_APP, PET_QLY, DME_APP, DME_QLY, RME_APP, RME_QLY, SELECTED, MARKS, ALLOC_POST, ALLOC_STAT, ALLOC_AREA, ALLOC_CAT, RANK, WITHHELD } = filters;//this here is the most important thing.here i am destructuring the input from filters that contains the input parameters. based ondestructuring some will get value and some will not. And base on that, down below👇 we are making filters. Here is the punch line. since i was trying to make a query which can take any provided condition, as many conditions as possible and together by And operator, i used all the field names present in my table. Now i can use any field inside the whereClause filter. 😎Baam.

  const whereClause = {
    where: {
      [Op.and]: [
                filters.EXAMNAME ? { 'EXAMNAME': filters.EXAMNAME } : {},
                filters.REGID ? { 'REGID': filters.REGID } : {},
                filters.ROLL ? { 'ROLL': filters.ROLL } : {},
                filters.NAME ? { 'NAME': filters.NAME } : {},
                filters.FATHERNAME ? { 'FATHERNAME': filters.FATHERNAME } : {},
                filters.MOTHERNAME ? { 'MOTHERNAME': filters.MOTHERNAME } : {},
                filters.DOB ? { 'DOB': filters.DOB } : {},
                filters.GENDER ? { 'GENDER': filters.GENDER } : {},
                filters.CAT1 ? { 'CAT1': filters.CAT1 } : {},
                filters.CAT2 ? { 'CAT2': filters.CAT2 } : {},
                filters.CAT3 ? { 'CAT3': filters.CAT3 } : {},
                filters.WRTN1_APP ? { 'WRTN1_APP': filters.WRTN1_APP } : {},
                filters.WRTN1_QLY ? { 'WRTN1_QLY': filters.WRTN1_QLY } : {},
                filters.WRTN2_APP ? { 'WRTN2_APP': filters.WRTN2_APP } : {},
                filters.WRTN2_QLY ? { 'WRTN2_QLY': filters.WRTN2_QLY } : {},
                filters.WRTN3_APP ? { 'WRTN3_APP': filters.WRTN3_APP } : {},
                filters.WRTN3_QLY ? { 'WRTN3_QLY': filters.WRTN3_QLY } : {},
                filters.INTVW_APP ? { 'INTVW_APP': filters.INTVW_APP } : {},
                filters.SKILL_APP ? { 'SKILL_APP': filters.SKILL_APP } : {},
                filters.SKILL_QLY ? { 'SKILL_QLY': filters.SKILL_QLY } : {},
                filters.PET_APP ? { 'PET_APP': filters.PET_APP } : {},
                filters.PET_QLY ? { 'PET_QLY': filters.PET_QLY } : {},
                filters.DME_APP ? { 'DME_APP': filters.DME_APP } : {},
                filters.DME_QLY ? { 'DME_QLY': filters.DME_QLY } : {},
                filters.RME_APP ? { 'RME_APP': filters.RME_APP } : {},
                filters.RME_QLY ? { 'RME_QLY': filters.RME_QLY } : {},
                filters.SELECTED ? { 'SELECTED': filters.SELECTED } : {},
                filters.MARKS ? { 'MARKS': filters.MARKS } : {},
                filters.ALLOC_POST ? { 'ALLOC_POST': filters.ALLOC_POST } : {},
                filters.ALLOC_STAT ? { 'ALLOC_STAT': filters.ALLOC_STAT } : {},
                filters.ALLOC_AREA ? { 'ALLOC_AREA': filters.ALLOC_AREA } : {},
                filters.ALLOC_CAT ? { 'ALLOC_CAT': filters.ALLOC_CAT } : {},
                filters.RANK ? { 'RANK': filters.RANK } : {},
                filters.WITHHELD ? { 'WITHHELD': filters.WITHHELD } : {}
        // Add any other conditions here
      ],
    },
};

const records = await allexamstableModel.findAll({
    ...whereClause,
     attributes: ['EXAMNAME', 'REGID', 'ROLL', 'NAME', 'FATHERNAME', 'MOTHERNAME', 'DOB', 'GENDER', 'CAT1', 'CAT2', 'CAT3', 'WRTN1_APP', 'WRTN1_QLY', 'WRTN2_APP', 'WRTN2_QLY', 'WRTN3_APP', 'WRTN3_QLY', 'INTVW_APP', 'SKILL_APP', 'SKILL_QLY', 'PET_APP', 'PET_QLY', 'DME_APP', 'DME_QLY', 'RME_APP', 'RME_QLY', 'SELECTED', 'MARKS', 'ALLOC_POST', 'ALLOC_STAT', 'ALLOC_AREA', 'ALLOC_CAT', 'RANK', 'WITHHELD'],
     /*NoteSuperConceptRemember It: 2️⃣ point is the most important in this project structure. 1️⃣ point is general information.  
     1️⃣ attributes: [], lets you get the output for on the column names that you have mentioned. Hence you may think that you need to write the names of all the attributes to get the output from all the columns when query is done. But sequelize is intelligent. If you simply omit the attributes:[], parameters it will simply mean that the output will be given for all the columns. No need to write all the column heads.
     👉Take A Good LookSuper2️⃣ in our defined allexamstableModel structure inside allexamstablemodel.js we have explicity turned off the primary key parameter. And by default, sequelize tries to give a primary key field named 'id'. since we were not allowed to make any modification to your table, we chose to suppress this default column named 'id'. hence we named all the attribute names(column names of our table) excluding the 'id'. now since  we were not mentioning the attributes, it meant to sequelize that we are also considering 'id' in this case. hence we will have to mention the attribute names to carry out successful query. 
     */
     limit,
     offset,// to implement pagination
  });

  return records;
};

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

        filters.CAT3 !== undefined ? (filters.CAT3 === "" ? { CAT3: { [Op.eq]: null } } :(filter.CAT3==="TOGETHER"?{CAT3: {[Op.ne]:null}}:{ CAT3: filters.CAT3 })): {},

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
        filters.ALLOC_CAT !== undefined ? (filters.ALLOC_CAT === "" ? { ALLOC_CAT: { [Op.eq]: null } } : { ALLOC_CAT: filters.ALLOC_CAT }) : {},
        filters.RANK !== undefined ? (filters.RANK === "" ? { RANK: { [Op.eq]: null } } : { RANK: filters.RANK }) : {},
        filters.WITHHELD !== undefined ? (filters.WITHHELD === "" ? { WITHHELD: { [Op.eq]: null } } : { WITHHELD: filters.WITHHELD }) : {}


        /* code upgrade👆
           filters.EXAMNAME ? { 'EXAMNAME': filters.EXAMNAME } : {},
            filters.REGID ? { 'REGID': filters.REGID } : {},
            filters.ROLL ? { 'ROLL': filters.ROLL } : {},
            filters.NAME ? { 'NAME': filters.NAME } : {},
            filters.FATHERNAME ? { 'FATHERNAME': filters.FATHERNAME } : {},
            filters.MOTHERNAME ? { 'MOTHERNAME': filters.MOTHERNAME } : {},
            filters.DOB ? { 'DOB': filters.DOB } : {},
            filters.GENDER ? { 'GENDER': filters.GENDER } : {},
            filters.CAT1 ? { 'CAT1': filters.CAT1 } : {},
            filters.CAT2 ? { 'CAT2': filters.CAT2 } : {},
            filters.CAT3 ? { 'CAT3': filters.CAT3 } : {},
            filters.WRTN1_APP ? { 'WRTN1_APP': filters.WRTN1_APP } : {},
            filters.WRTN1_QLY ? { 'WRTN1_QLY': filters.WRTN1_QLY } : {},
            filters.WRTN2_APP ? { 'WRTN2_APP': filters.WRTN2_APP } : {},
            filters.WRTN2_QLY ? { 'WRTN2_QLY': filters.WRTN2_QLY } : {},
            filters.WRTN3_APP ? { 'WRTN3_APP': filters.WRTN3_APP } : {},
            filters.WRTN3_QLY ? { 'WRTN3_QLY': filters.WRTN3_QLY } : {},
            filters.INTVW_APP ? { 'INTVW_APP': filters.INTVW_APP } : {},
            filters.SKILL_APP ? { 'SKILL_APP': filters.SKILL_APP } : {},
            filters.SKILL_QLY ? { 'SKILL_QLY': filters.SKILL_QLY } : {},
            filters.PET_APP ? { 'PET_APP': filters.PET_APP } : {},
            filters.PET_QLY ? { 'PET_QLY': filters.PET_QLY } : {},
            filters.DME_APP ? { 'DME_APP': filters.DME_APP } : {},
            filters.DME_QLY ? { 'DME_QLY': filters.DME_QLY } : {},
            filters.RME_APP ? { 'RME_APP': filters.RME_APP } : {},
            filters.RME_QLY ? { 'RME_QLY': filters.RME_QLY } : {},
            filters.SELECTED ? { 'SELECTED': filters.SELECTED } : {},
            filters.MARKS ? { 'MARKS': filters.MARKS } : {},
            filters.ALLOC_POST ? { 'ALLOC_POST': filters.ALLOC_POST } : {},
            filters.ALLOC_STAT ? { 'ALLOC_STAT': filters.ALLOC_STAT } : {},
            filters.ALLOC_AREA ? { 'ALLOC_AREA': filters.ALLOC_AREA } : {},
            filters.ALLOC_CAT ? { 'ALLOC_CAT': filters.ALLOC_CAT } : {},
            filters.RANK ? { 'RANK': filters.RANK } : {},
            filters.WITHHELD ? { 'WITHHELD': filters.WITHHELD } : {}
            */
      ],
    },
};
    const count=await allexamstableModel.count({
        ...whereClause,
    });
  return count;
};

  module.exports = {
  getRecordsByFilters,
  getRecordsCountByFilters,
};