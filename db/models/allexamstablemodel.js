'use strict';
const {Model} = require('sequelize');

const { DataTypes } = require('sequelize');
const sequelize = require('./../../config/database'); // Replace with your Sequelize instance
module.exports = sequelize;

const dotenv = require('dotenv');
dotenv.config({path:`${process.cwd()}/config.env`});//is recipe! not concept


const allexamstableModel = sequelize.define('allexamstableModel', {
    // id: {
    //     type: DataTypes.UUID,
    //     defaultValue: DataTypes.UUIDV4,
    //     primaryKey: true,
    // },//Note:this code could be used to create primary key on fly. since our table doesn't need one, hence i have commented it out. But it's 👩‍🍳💋 
  EXAMNAME: {
    type: DataTypes.STRING(50),
    allowNull: false,
    //defaultValue:'no Exam name'//Note this is now you specify default value to be passed to the field.
  },
  REGID: {
    type: DataTypes.STRING(12),
    allowNull: false
  },
  ROLL: {
    type: DataTypes.STRING(12),
    allowNull: false
  },
  NAME: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  FATHERNAME: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  MOTHERNAME: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  DOB: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  GENDER: {
    type: DataTypes.STRING(12),
    allowNull: false
  },
  CAT1: {
    type: DataTypes.STRING(2),
    allowNull: false
  },
  CAT2: {
    type: DataTypes.STRING(2),
    allowNull: false
  },
  CAT3: {
    type: DataTypes.STRING(2),
    allowNull: false
  },
  WRTN1_APP: {
    type: DataTypes.STRING(3),
    allowNull: false
  },
  WRTN1_QLY: {
    type: DataTypes.STRING(3),
    allowNull: false
  },
  WRTN2_APP: {
    type: DataTypes.STRING(3),
    allowNull: false
  },
  WRTN2_QLY: {
    type: DataTypes.STRING(3),
    allowNull: false
  },
  WRTN3_APP: {
    type: DataTypes.STRING(3),
    allowNull: false
  },
  WRTN3_QLY: {
    type: DataTypes.STRING(3),
    allowNull: false
  },
  INTVW_APP: {
    type: DataTypes.STRING(3),
    allowNull: false
  },
  SKILL_APP: {
    type: DataTypes.STRING(3),
    allowNull: false
  },
  SKILL_QLY: {
    type: DataTypes.STRING(3),
    allowNull: false
  },
  PET_APP: {
    type: DataTypes.STRING(3),
    allowNull: false
  },
  PET_QLY: {
    type: DataTypes.STRING(3),
    allowNull: false
  },
  DME_APP: {
    type: DataTypes.STRING(3),
    allowNull: false
  },
  DME_QLY: {
    type: DataTypes.STRING(3),
    allowNull: false
  },
  RME_APP: {
    type: DataTypes.STRING(3),
    allowNull: false
  },
  RME_QLY: {
    type: DataTypes.STRING(3),
    allowNull: false
  },
  SELECTED: {
    type: DataTypes.STRING(3),
    allowNull: false
  },
  MARKS: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
  ALLOC_POST: {
    type: DataTypes.STRING(5),
    allowNull: false
  },
  ALLOC_STAT: {
    type: DataTypes.STRING(2),
    allowNull: false
  },
  ALLOC_AREA: {
    type: DataTypes.STRING(3),
    allowNull: false
  },
  ALLOC_CAT: {
    type: DataTypes.STRING(2),
    allowNull: false
  },
  RANK: {
    type: DataTypes.STRING(15),
    allowNull: false
  },
  WITHHELD: {
    type: DataTypes.STRING(2),
    allowNull: false
  },
//   deletedAt:{
//     type:DataTypes.DATE,
//   }// to have paranoid feature in your database, you must have a coloumn named deletedAt, but since i can't change our database without permission, i am keeping this option ready for future.
}, {
  tableName:`${process.env.DB_TABLE_NAME}`, // Specify the existing table name

  //----SuperEither you mention the Primary key----
  //primaryKey: 'ROLL', // Specify the column to be used as the primary key
  //----SuperOr you specify no Primarykey exists---
  primaryKey: false, // Disable the default primary key behavior
  //ConceptSuper if you don't do any one of the above two things, you will get error during api call in postman. 

  timestamps: false, // Disable Sequelize's automatic timestamp columns
  freezeTableName: true, // Prevent Sequelize from modifying the table name
  createdAt: false,// this is given by default. we don't want it so wrote false
  updatedAt: false,//updateTimeStamp,// is given by default. we don't need it.
  //paranoid: true,// to soft delete the data. 
});// Concept: there is no "sequelize.sync() or sequelize.sync({alter: true})" used in this code. Becouse i already have existing table which needs to be recognised, not all kind of alteration to it. Hence, we simply not used this command. Becouse these are used when creating new table. we didn't use even the alter:true containing command becouse if by chance, if there happens to be any discripancy between model and table structure, the sequelize will take the initiative and change the structure of our table which need not be touched in any case. Hence, even this command was left out. 

module.exports = allexamstableModel;
// Remember It: right after above code is didn't not use 👎💀"npx sequelize-cli db:create"❌❌. becouse this code is used when you want to make a new table. In our case, we want sequelize to know the existing table that we already have without making any changes. Hence we used ✅"npx sequelize-cli db:migrate"✅ to let the sequelize know the existance our table and the schema should match with our model defination. And ✅"npx sequelize-cli db:migrate:status"✅ was used to know the status of migration that we had undertook.  



/*code upgrade👆 this is a method to do it as well. But there is another way, which is the code upgrade we have given above.
module.exports = (sequelize, DataTypes) => {
  class allexamstableModel extends Model {
    
     // Helper method for defining associations.
     // This method is not a part of Sequelize lifecycle.
     // The `models/index` file will call this method automatically.
     
    static associate(models) {
      // define association here
    }
  }
  allexamstableModel.init({
    EXAMNAME: DataTypes.STRING,
    REGID: DataTypes.STRING,
    ROLL: DataTypes.STRING,
    NAME: DataTypes.STRING,
    FATHERNAME: DataTypes.STRING,
    MOTHERNAME: DataTypes.STRING,
    DOB: DataTypes.DATE,
    GENDER: DataTypes.STRING,
    CAT1: DataTypes.STRING,
    CAT2: DataTypes.STRING,
    CAT3: DataTypes.STRING,
    WRTN1_APP: DataTypes.STRING,
    WRTN1_QLY: DataTypes.STRING,
    WRTN2_APP: DataTypes.STRING,
    WRTN2_QLY: DataTypes.STRING,
    WRTN3_APP: DataTypes.STRING,
    WRTN3_QLY: DataTypes.STRING,
    INTVW_APP: DataTypes.STRING,
    SKILL_APP: DataTypes.STRING,
    SKILL_QLY: DataTypes.STRING,
    PET_APP: DataTypes.STRING,
    PET_QLY: DataTypes.STRING,
    DME_APP: DataTypes.STRING,
    DME_QLY: DataTypes.STRING,
    RME_APP: DataTypes.STRING,
    RME_QLY: DataTypes.STRING,
    SELECTED: DataTypes.STRING,
    MARKS: DataTypes.STRING,
    ALLOC_POST: DataTypes.STRING,
    ALLOC_STAT: DataTypes.STRING,
    ALLOC_AREA: DataTypes.STRING,
    ALLOC_CAT: DataTypes.STRING,
    RANK: DataTypes.STRING,
    WITHHELD: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'allexamstableModel',
  });
  return allexamstableModel;
};
*/