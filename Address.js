const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.js');

const Address = sequelize.define('Address', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  fullName: { type: DataTypes.STRING },
  phone: { type: DataTypes.STRING },
  street: { type: DataTypes.STRING },
  landmark: { type: DataTypes.STRING },
  city: { type: DataTypes.STRING },
  state: { type: DataTypes.STRING },
  pincode: { type: DataTypes.STRING },
  isDefault: { type: DataTypes.BOOLEAN, defaultValue: false }
});

module.exports = Address;

