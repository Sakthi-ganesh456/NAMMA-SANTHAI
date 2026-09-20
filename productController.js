const { Op } = require('sequelize');
const { Product, SellerProfile } = require('../models');

// @desc    Fetch all products with filtering & search
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const { category, search, sort, organic, seasonal, seller } = req.query;
    let where = {};

    if (category && category !== 'all') {
      where.category = category;
    }

    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { tamilName: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }

    if (organic === 'true') {
      where.isOrganic = true;
    }

    if (seasonal === 'true') {
      where.isSeasonal = true;
    }

    if (seller) {
      where.sellerId = seller;
    }

    let order = [];
    if (sort === 'price-low') {
      order = [['discountPrice', 'ASC'], ['price', 'ASC']];
    } else if (sort === 'price-high') {
      order = [['discountPrice', 'DESC'], ['price', 'DESC']];
    } else if (sort === 'rating') {
      order = [['rating', 'DESC']];
    } else {
      order = [['isBestSeller', 'DESC'], ['createdAt', 'DESC']];
    }

    const products = await Product.findAll({
      where,
      order,
      include: [{
        model: require('../models').User,
        as: 'seller',
        attributes: ['name'],
        include: [{ model: SellerProfile, as: 'sellerProfile', attributes: ['farmName', 'village', 'isVerified'] }]
      }]
    });

    const mappedProducts = products.map(p => {
      const data = p.toJSON();
      data._id = data.id; // compat
      return data;
    });

    return res.json(mappedProducts);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Error retrieving products' });
  }
};

// @desc    Fetch single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id, {
      include: [{
        model: require('../models').User,
        as: 'seller',
        attributes: ['name'],
        include: [{ model: SellerProfile, as: 'sellerProfile' }]
      }]
    });

    if (product) {
      const data = product.toJSON();
      data._id = data.id;
      return res.json(data);
    }
    res.status(404).json({ message: 'Product not found' });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving product' });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const productData = { ...req.body };
    if (productData.stock !== undefined) {
      productData.inStock = Number(productData.stock) > 0;
    }
    const product = await Product.create(productData);
    const data = product.toJSON();
    data._id = data.id;
    return res.status(201).json(data);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(400).json({ message: error.message || 'Invalid product data' });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    Object.assign(product, req.body);
    if (req.body.stock !== undefined) {
      product.inStock = Number(req.body.stock) > 0;
    }
    await product.save();
    const data = product.toJSON();
    data._id = data.id;
    return res.json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    await product.destroy();
    return res.json({ message: 'Product removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
