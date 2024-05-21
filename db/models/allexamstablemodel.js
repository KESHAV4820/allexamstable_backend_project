const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Replace with your Sequelize instance

const AllexamsTableModel = sequelize.define('AllexamsTableModel', {
  EXAMNAME: {
    type: DataTypes.STRING(50),
    allowNull: false
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
  }
}, {
  tableName: 'allexamstable', // Specify the existing table name
  timestamps: false, // Disable Sequelize's automatic timestamp columns
  freezeTableName: true // Prevent Sequelize from modifying the table name
});

module.exports = AllexamsTableModel;