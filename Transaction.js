const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.js');

const Transaction = sequelize.define('Transaction', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  type: {
    type: DataTypes.ENUM('sale_earning', 'investment_received', 'investment_made', 'profit_payout', 'withdrawal', 'platform_commission'),
    allowNull: false
  },
  amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  balanceBefore: { type: DataTypes.DECIMAL(10, 2) },
  balanceAfter: { type: DataTypes.DECIMAL(10, 2) },
  referenceId: { type: DataTypes.INTEGER },
  referenceType: { type: DataTypes.ENUM('order', 'investment') },
  description: { type: DataTypes.STRING }
});

module.exports = Transaction;

