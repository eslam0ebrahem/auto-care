require('dotenv').config();
const { Sequelize } = require('sequelize');
const db = {};

const DB_NAME = process.env.DB_NAME || 'auto_care';
const DB_USER = process.env.DB_USER || process.env.USER || 'postgres';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || 5432;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: 'postgres',
  port: DB_PORT,
  logging: false,
});

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Vehicle = require('./vehicleModel.js')(sequelize,Sequelize);
db.Service = require('./serviceModel.js')(sequelize,Sequelize);

db.Vehicle.hasMany(db.Service, {
  foreignKey: 'vehicleId',
  onDelete: 'CASCADE'
});

db.Service.belongsTo(db.Vehicle, {
  foreignKey: 'vehicleId'
});

module.exports = db;