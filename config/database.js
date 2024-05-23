const sequelizeInstance = require('sequelize');

const env=process.config.NODE_ENV || 'development';
const config = require('./config');
const sequelize = new sequelizeInstance(config[env]);

module.exports = sequelize;