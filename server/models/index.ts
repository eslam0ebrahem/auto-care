import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';
import createUserModel from './userModel';
import createVehicleModel from './vehicleModel';
import createServiceModel from './serviceModel';

dotenv.config();

const db: any = {};

const DB_NAME = process.env.DB_NAME || 'auto_care';
const DB_USER = process.env.DB_USER || process.env.USER || 'postgres';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = parseInt(process.env.DB_PORT || '5432', 10);

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: 'postgres',
  port: DB_PORT,
  logging: false,
});

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = createUserModel(sequelize);
db.Vehicle = createVehicleModel(sequelize);
db.Service = createServiceModel(sequelize);

db.User.hasMany(db.Vehicle, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
});

db.Vehicle.belongsTo(db.User, {
  foreignKey: 'userId',
});

db.Vehicle.hasMany(db.Service, {
  foreignKey: 'vehicleId',
  onDelete: 'CASCADE',
});

db.Service.belongsTo(db.Vehicle, {
  foreignKey: 'vehicleId',
});

export default db;
