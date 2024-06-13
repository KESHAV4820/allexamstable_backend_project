/*
1. this file "index.js" in models folder and migration files in "migration folder" will be created by sequelize when you enter the following command👇.
2. Following are the commands that were used for "Acknowledging the pre-existing table", without creating any changes to it. 
👉✅ npx sequelize-cli model:generate --name allexamstableModel --attributes EXAMNAME:string,REGID:string,ROLL:string,NAME:string,FATHERNAME:string,MOTHERNAME:string,DOB:DATE,GENDER:string,CAT1:string,CAT2:string,CAT3:string,WRTN1_APP:string,WRTN1_QLY:string,WRTN2_APP:string,WRTN2_QLY:string,WRTN3_APP:string,WRTN3_QLY:string,INTVW_APP:string,SKILL_APP:string,SKILL_QLY:string,PET_APP:string,PET_QLY:string,DME_APP:string,DME_QLY:string,RME_APP:string,RME_QLY:string,SELECTED:string,MARKS:string,ALLOC_POST:string,ALLOC_STAT:string,ALLOC_AREA:string,ALLOC_CAT:string,RANK:string,WITHHELD:string
Concept: we aren't using model:create, becouse we aren't creating a new database or table into it. we are using model:generate since we are trying to familiarlise our sequelize with the existing table in the database. 
  💀❌not this way❌npx sequelize-cli model:generate --name allexamstableModel --attributes EXAMNAME:string(50),REGID:string(12),ROLL:string(12),NAME:string(50),FATHERNAME:string(50),MOTHERNAME:string(50),DOB:DATE,GENDER:string(12),CAT1:string(2),CAT2:string(2),CAT3:string(2),WRTN1_APP:string(3),WRTN1_QLY:string(3),WRTN2_APP:string(3),WRTN2_QLY:string(3),WRTN3_APP:string(3),WRTN3_QLY:string(3),INTVW_APP:string(3),SKILL_APP:string(3),SKILL_QLY:string(3),PET_APP:string(3),PET_QLY:string(3),DME_APP:string(3),DME_QLY:string(3),RME_APP:string(3),RME_QLY:string(3),SELECTED:string(3),MARKS:string(10),ALLOC_POST:string(5),ALLOC_STAT:string(2),ALLOC_AREA:string(3),ALLOC_CAT:string(2),RANK:string(15),WITHHELD:string(2)❌
👉npx sequelize-cli db:migrate
👉npx sequelize-cli db:migrate:status
👉node -e 
"Object.keys(require.cache).forEach(function(key) { delete require.cache[key] })"
👉npm install pg
*/

'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../../config/config.js')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}// Note: here i have added ",{logging: true}" at the end. It wasn't there ealier. If there is some error going forward, remove it. It is meant to show you what exactly the query that sequelize is creating against the instruction that you are giving.

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
