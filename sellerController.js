const { Product, Order, OrderItem, SellerProfile, Transaction } = require('../models');

// @desc    Get seller dashboard stats
// @route   GET /api/seller/dashboard
// @access  Private/Seller
const getSellerDashboard = async (req, res) => {
  try {
    const profile = await SellerProfile.findOne({ where: { userId: req.user.id } });
    const productsCount = await Product.count({ where: { sellerId: req.user.id } });
    
    // Find orders containing seller's products
    const orderItems = await OrderItem.findAll({ where: { sellerId: req.user.id } });
    const pendingOrdersCount = orderItems.length; // Simplified for demo

    res.json({
      profile,
      stats: {
        totalRevenue: profile ? profile.totalEarnings : 0,
        activeProducts: productsCount,
        pendingOrders: pendingOrdersCount,
        availableBalance: profile ? profile.availableBalance : 0
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add seller product
// @route   POST /api/seller/products
// @access  Private/Seller
const addSellerProduct = async (req, res) => {
  try {
    const { name, tamilName, category, description, price, discountPrice, unit, image, stock, isOrganic, isSeasonal } = req.body;
    
    const product = await Product.create({
      sellerId: req.user.id,
      name, tamilName, category, description, price, discountPrice, unit, image, stock, isOrganic, isSeasonal
    });
    
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get seller products
// @route   GET /api/seller/products
// @access  Private/Seller
const getSellerProducts = async (req, res) => {
  try {
    const products = await Product.findAll({ where: { sellerId: req.user.id } });
    // mapping id to _id for frontend compatibility
    const mapped = products.map(p => {
      const data = p.toJSON();
      data._id = data.id;
      return data;
    });
    res.json(mapped);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getSellerDashboard,
  addSellerProduct,
  getSellerProducts
};
