const express = require('express');
const router = express.Router();
const { getSellerDashboard, addSellerProduct, getSellerProducts } = require('../controllers/sellerController');
const { protect, seller } = require('../middleware/authMiddleware');

router.route('/dashboard').get(protect, seller, getSellerDashboard);
router.route('/products').get(protect, seller, getSellerProducts).post(protect, seller, addSellerProduct);

module.exports = router;
