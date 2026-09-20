const bcrypt = require('bcryptjs');
const { User, SellerProfile, Address } = require('../models');
const { generateToken } = require('../middleware/authMiddleware');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, role, farmName, village, district } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email, and password' });
    }

    const userExists = await User.findOne({ where: { email: email.toLowerCase() } });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const userRole = role === 'admin' ? 'admin' : (role === 'seller' ? 'seller' : 'customer');

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      phone: phone || '',
      role: userRole,
      village: village || '',
      district: district || ''
    });

    if (userRole === 'seller') {
      await SellerProfile.create({
        userId: user.id,
        farmName: farmName || `${name}'s Farm`,
        village: village || '',
        district: district || '',
        isVerified: false
      });
    }

    return res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      token: generateToken(user.id),
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: error.message || 'Server error during registration' });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ 
      where: { email: email.toLowerCase() },
      include: [{ model: Address, as: 'addresses' }]
    });

    if (user && (await user.matchPassword(password))) {
      return res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        addresses: user.addresses || [],
        token: generateToken(user.id),
      });
    } else {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: error.message || 'Server error during login' });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Address, as: 'addresses' }]
    });
    
    if (user) {
      const userData = user.toJSON();
      userData._id = userData.id;
      return res.json(userData);
    }
    res.status(404).json({ message: 'User not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile & addresses
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const { name, phone, address } = req.body;

    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.name = name || user.name;
    user.phone = phone || user.phone;
    await user.save();

    if (address) {
      await Address.create({
        userId: user.id,
        ...address
      });
    }

    const updatedUser = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Address, as: 'addresses' }]
    });

    const userData = updatedUser.toJSON();
    userData._id = userData.id;

    return res.json(userData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser, getUserProfile, updateUserProfile };
