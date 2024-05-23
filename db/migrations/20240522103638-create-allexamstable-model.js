'use strict';
const { DataTypes } = require('sequelize');//added
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const allexamstableModel= queryInterface.sequelize.define(
      'allexamstableModel',
      {//added
    // await queryInterface.createTable('allexamstable', {
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
        /* code upgrade👆
                      id: {
                        allowNull: false,
                        autoIncrement: true,
                        primaryKey: true,
                        type: Sequelize.INTEGER
                      },
                      EXAMNAME: {
                        type: Sequelize.STRING
                      },
                      REGID: {
                        type: Sequelize.STRING
                      },
                      ROLL: {
                        type: Sequelize.STRING
                      },
                      NAME: {
                        type: Sequelize.STRING
                      },
                      FATHERNAME: {
                        type: Sequelize.STRING
                      },
                      MOTHERNAME: {
                        type: Sequelize.STRING
                      },
                      DOB: {
                        type: Sequelize.DATE
                      },
                      GENDER: {
                        type: Sequelize.STRING
                      },
                      CAT1: {
                        type: Sequelize.STRING
                      },
                      CAT2: {
                        type: Sequelize.STRING
                      },
                      CAT3: {
                        type: Sequelize.STRING
                      },
                      WRTN1_APP: {
                        type: Sequelize.STRING
                      },
                      WRTN1_QLY: {
                        type: Sequelize.STRING
                      },
                      WRTN2_APP: {
                        type: Sequelize.STRING
                      },
                      WRTN2_QLY: {
                        type: Sequelize.STRING
                      },
                      WRTN3_APP: {
                        type: Sequelize.STRING
                      },
                      WRTN3_QLY: {
                        type: Sequelize.STRING
                      },
                      INTVW_APP: {
                        type: Sequelize.STRING
                      },
                      SKILL_APP: {
                        type: Sequelize.STRING
                      },
                      SKILL_QLY: {
                        type: Sequelize.STRING
                      },
                      PET_APP: {
                        type: Sequelize.STRING
                      },
                      PET_QLY: {
                        type: Sequelize.STRING
                      },
                      DME_APP: {
                        type: Sequelize.STRING
                      },
                      DME_QLY: {
                        type: Sequelize.STRING
                      },
                      RME_APP: {
                        type: Sequelize.STRING
                      },
                      RME_QLY: {
                        type: Sequelize.STRING
                      },
                      SELECTED: {
                        type: Sequelize.STRING
                      },
                      MARKS: {
                        type: Sequelize.STRING
                      },
                      ALLOC_POST: {
                        type: Sequelize.STRING
                      },
                      ALLOC_STAT: {
                        type: Sequelize.STRING
                      },
                      ALLOC_AREA: {
                        type: Sequelize.STRING
                      },
                      ALLOC_CAT: {
                        type: Sequelize.STRING
                      },
                      RANK: {
                        type: Sequelize.STRING
                      },
                      WITHHELD: {
                        type: Sequelize.STRING
                      },
                      createdAt: {
                        allowNull: false,
                        type: Sequelize.DATE
                      },
                      updatedAt: {
                        allowNull: false,
                        type: Sequelize.DATE
                      }
                    */
    },{
      tableName: 'allexamstable', // Specify the existing table name
      //----SuperEither you mention the Primary key----
      //primaryKey: 'ROLL', // Specify the column to be used as the primary key
      //----SuperOr you specify no Primarykey exists---
      primaryKey: false, // Disable the default primary key behavior
      //ConceptSuper if you don't do any one of the above two things, you will get error during api call in postman.
      timestamps: false, // Disable Sequelize's automatic timestamp columns
      freezeTableName: true, // Prevent Sequelize from modifying the table name
      createdAt: false,// this is given by default. we don't want it so wrote false
      updatedAt: false,//updateTimeStamp,// is given by default. we don't need it.
      //paranoid: true,// for soft delete. 🤭once you give a data, you never get it. They never delete it.😵
    });// Concept: there is no "sequelize.sync() or sequelize.sync({alter: true})" used in this code. Becouse i already have existing table which needs to be recognised, not all kind of alteration to it. Hence, we simply not used this command. Becouse these are used when creating new table. we didn't use even the alter:true containing command becouse if by chance, if there happens to be any discripancy between model and table structure, the sequelize will take the initiative and change the structure of our table which need not be touched in any case. Hence, even this command was left out.

    return allexamstableModel;
  },
  async down(queryInterface, Sequelize) {
  //  await queryInterface.dropTable('allexamstableModels');

  const allexamstableModel = queryInterface.sequelize.models.allexamstableModel;
    if (allexamstableModel) {
      await allexamstableModel.drop();
    }
  }
};// Remember It: right after above code is didn't not use 👎💀"npx sequelize-cli db:create"❌❌. becouse this code is used when you want to make a new table. In our case, we want sequelize to know the existing table that we already have without making any changes. Hence we used ✅"npx sequelize-cli db:migrate"✅ to let the sequelize know the existance our table and the schema should match with our model defination. And ✅"npx sequelize-cli db:migrate:status"✅ was used to know the status of migration that we had undertook.