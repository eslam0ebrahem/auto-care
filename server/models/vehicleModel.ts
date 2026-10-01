import { DataTypes, Sequelize } from 'sequelize';

export default (sequelize: Sequelize) =>
  sequelize.define('Vehicle', {
    make: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    model: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1900,
      },
    },
    licensePlate: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
