const sequelize = require('../config/db.js');
const User = require('./User.js');
const Address = require('./Address.js');
const Product = require('./Product.js');
const Order = require('./Order.js');
const OrderItem = require('./OrderItem.js');
const OrderTimeline = require('./OrderTimeline.js');
const SellerProfile = require('./SellerProfile.js');
const Investment = require('./Investment.js');
const Transaction = require('./Transaction.js');
const Village = require('./Village.js');

// User Associations
User.hasOne(SellerProfile, { foreignKey: 'userId', as: 'sellerProfile' });
SellerProfile.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Address, { foreignKey: 'userId', as: 'addresses' });
Address.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Product, { foreignKey: 'sellerId', as: 'products' });
Product.belongsTo(User, { foreignKey: 'sellerId', as: 'seller' });

User.hasMany(Order, { foreignKey: 'userId', as: 'orders' });
Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Investment Associations
User.hasMany(Investment, { foreignKey: 'investorId', as: 'investmentsMade' });
Investment.belongsTo(User, { foreignKey: 'investorId', as: 'investor' });

User.hasMany(Investment, { foreignKey: 'sellerId', as: 'investmentsReceived' });
Investment.belongsTo(User, { foreignKey: 'sellerId', as: 'seller' });

// Transaction Associations
User.hasMany(Transaction, { foreignKey: 'userId', as: 'transactions' });
Transaction.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Order Associations
Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'orderItems' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

Order.hasMany(OrderTimeline, { foreignKey: 'orderId', as: 'timeline' });
OrderTimeline.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

// Product to OrderItem
Product.hasMany(OrderItem, { foreignKey: 'productId' });
OrderItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

module.exports = {
  sequelize,
  User,
  Address,
  Product,
  Order,
  OrderItem,
  OrderTimeline,
  SellerProfile,
  Investment,
  Transaction,
  Village
};

