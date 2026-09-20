const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.js');

const SellerProfile = sequelize.define('SellerProfile', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false, unique: true },
  farmName: { type: DataTypes.STRING },
  farmNameTamil: { type: DataTypes.STRING },
  farmSize: { type: DataTypes.STRING },
  farmLocation: { type: DataTypes.STRING },
  village: { type: DataTypes.STRING },
  district: { type: DataTypes.STRING },
  bankAccountNo: { type: DataTypes.STRING },
  bankIFSC: { type: DataTypes.STRING },
  bankName: { type: DataTypes.STRING },
  upiId: { type: DataTypes.STRING },
  totalEarnings: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.0 },
  availableBalance: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.0 },
  totalInvestmentReceived: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.0 },
  description: { type: DataTypes.TEXT },
  certifications: { type: DataTypes.JSON, defaultValue: [] },
  isVerified: { type: DataTypes.BOOLEAN, defaultValue: false }
});

module.exports = SellerProfile;

