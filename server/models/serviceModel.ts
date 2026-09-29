import { DataTypes, Sequelize } from 'sequelize';

export default (sequelize: Sequelize) =>
  sequelize.define('Service', {
    serviceType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    mileage: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    cost: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    notes: {
      type: DataTypes.TEXT,
    },
  });
