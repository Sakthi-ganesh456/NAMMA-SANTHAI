const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.js');

const Investment = sequelize.define('Investment', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  investorId: { type: DataTypes.INTEGER, allowNull: false },
  sellerId: { type: DataTypes.INTEGER, allowNull: false },
  amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  returnPercentage: { type: DataTypes.DECIMAL(5, 2), allowNull: false },
  status: {
    type: DataTypes.ENUM('active', 'matured', 'withdrawn', 'cancelled'),
    defaultValue: 'active'
  },
  investedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  maturityDate: { type: DataTypes.DATE },
  returnAmount: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.0 },
  profitEarned: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.0 },
  description: { type: DataTypes.STRING }
});

module.exports = Investment;

