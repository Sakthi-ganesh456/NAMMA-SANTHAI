const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.js');

const Order = sequelize.define('Order', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  deliveryAddress: { type: DataTypes.JSON, allowNull: false },
  deliverySlot: { type: DataTypes.JSON, allowNull: false },
  paymentMethod: { type: DataTypes.ENUM('COD', 'UPI', 'Card'), defaultValue: 'COD' },
  paymentTiming: { type: DataTypes.ENUM('before_order', 'after_order'), defaultValue: 'before_order' },
  paymentStatus: { type: DataTypes.ENUM('Pending', 'Paid', 'Failed'), defaultValue: 'Pending' },
  paymentReference: { type: DataTypes.STRING, defaultValue: '' },
  orderStatus: {
    type: DataTypes.ENUM('Placed', 'Confirmed', 'Packed', 'Out for Delivery', 'Delivered', 'Cancelled'),
    defaultValue: 'Placed'
  },
  itemsPrice: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.0 },
  deliveryPrice: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.0 },
  discountAmount: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.0 },
  totalPrice: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.0 },
  sellerEarnings: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.0 },
  platformCommission: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.0 },
  notes: { type: DataTypes.STRING, defaultValue: '' }
});

module.exports = Order;
