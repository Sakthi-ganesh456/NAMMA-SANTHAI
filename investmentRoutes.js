const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getInvestmentOpportunities, createInvestment, getPortfolio } = require('../controllers/investmentController');

router.get('/sellers', getInvestmentOpportunities);
router.get('/portfolio', protect, getPortfolio);
router.post('/', protect, createInvestment);

module.exports = router;
