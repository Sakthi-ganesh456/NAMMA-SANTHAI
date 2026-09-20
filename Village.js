const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.js');

const Village = sequelize.define('Village', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  nameTamil: { type: DataTypes.STRING },
  district: { type: DataTypes.STRING },
  state: { type: DataTypes.STRING, defaultValue: 'Tamil Nadu' },
  pincode: { type: DataTypes.STRING },
  coordinatorName: { type: DataTypes.STRING },
  coordinatorPhone: { type: DataTypes.STRING },
  totalSellers: { type: DataTypes.INTEGER, defaultValue: 0 },
  totalCustomers: { type: DataTypes.INTEGER, defaultValue: 0 },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true }
});

module.exports = Village;

