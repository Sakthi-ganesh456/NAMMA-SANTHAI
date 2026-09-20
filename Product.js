const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.js');

const Product = sequelize.define('Product', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  sellerId: { type: DataTypes.INTEGER, allowNull: true },
  name: { type: DataTypes.STRING, allowNull: false },
  tamilName: { type: DataTypes.STRING, defaultValue: '' },
  category: {
    type: DataTypes.ENUM('vegetables', 'fruits', 'greens', 'organic-combos', 'seasonal'),
    allowNull: false
  },
  description: { type: DataTypes.TEXT, allowNull: false },
  price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  discountPrice: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  unit: { type: DataTypes.STRING, defaultValue: '1 kg' },
  image: { type: DataTypes.STRING, allowNull: false },
  images: { type: DataTypes.JSON, defaultValue: [] },
  stock: { type: DataTypes.INTEGER, defaultValue: 50 },
  inStock: { type: DataTypes.BOOLEAN, defaultValue: true },
  isOrganic: { type: DataTypes.BOOLEAN, defaultValue: false },
  isSeasonal: { type: DataTypes.BOOLEAN, defaultValue: false },
  isBestSeller: { type: DataTypes.BOOLEAN, defaultValue: false },
  rating: { type: DataTypes.DECIMAL(3, 1), defaultValue: 4.8 },
  numReviews: { type: DataTypes.INTEGER, defaultValue: 12 },
  origin: { type: DataTypes.STRING, defaultValue: 'Direct from Local Farmers' },
  nutritionHighlights: { type: DataTypes.JSON, defaultValue: [] },
  effectivePrice: {
    type: DataTypes.VIRTUAL,
    get() {
      const dp = parseFloat(this.discountPrice);
      const p = parseFloat(this.price);
      return dp > 0 ? dp : p;
    }
  }
});

module.exports = Product;

