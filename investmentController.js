const { Investment, SellerProfile, User, Product, Transaction } = require('../models');
const sequelize = require('../config/db');

const DEFAULT_RETURN_PERCENTAGE = 8;
const MINIMUM_INVESTMENT = 500;

const serialize = (record) => {
  const data = record.toJSON();
  data._id = data.id;
  return data;
};

const getInvestmentOpportunities = async (req, res) => {
  try {
    const sellers = await User.findAll({
      where: { role: 'seller' },
      attributes: ['id', 'name', 'village', 'district'],
      include: [
        { model: SellerProfile, as: 'sellerProfile', attributes: ['farmName', 'farmNameTamil', 'farmLocation', 'description', 'totalInvestmentReceived', 'isVerified'] },
        { model: Product, as: 'products', attributes: ['id', 'name', 'category', 'price', 'stock', 'image'] },
      ],
    });

    res.json(sellers.map((seller) => {
      const data = seller.toJSON();
      const profile = data.sellerProfile || {};
      return {
        sellerId: data.id,
        name: data.name,
        village: data.village,
        district: data.district,
        farmName: profile.farmName || `${data.name}'s Farm`,
        farmNameTamil: profile.farmNameTamil || '',
        farmLocation: profile.farmLocation || data.village || 'Tamil Nadu',
        description: profile.description || 'Support a local farm and help bring fresh produce to rural families.',
        isVerified: profile.isVerified === true,
        returnPercentage: DEFAULT_RETURN_PERCENTAGE,
        minimumInvestment: MINIMUM_INVESTMENT,
        totalInvestmentReceived: Number(profile.totalInvestmentReceived || 0),
        products: data.products || [],
      };
    }));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createInvestment = async (req, res) => {
  const amount = Number(req.body.amount);
  const sellerId = Number(req.body.sellerId);

  if (!Number.isFinite(amount) || amount < MINIMUM_INVESTMENT) {
    return res.status(400).json({ message: `Investment must be at least ₹${MINIMUM_INVESTMENT}.` });
  }
  if (!Number.isInteger(sellerId)) {
    return res.status(400).json({ message: 'A valid seller is required.' });
  }

  const transaction = await sequelize.transaction();
  try {
    const seller = await User.findOne({
      where: { id: sellerId, role: 'seller' },
      include: [{ model: SellerProfile, as: 'sellerProfile' }],
      transaction,
      lock: transaction.LOCK.UPDATE,
    });
    if (!seller || !seller.sellerProfile) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Seller investment opportunity not found.' });
    }

    const maturityDate = new Date();
    maturityDate.setMonth(maturityDate.getMonth() + 3);
    const profitEarned = Number((amount * (DEFAULT_RETURN_PERCENTAGE / 100)).toFixed(2));
    const investment = await Investment.create({
      investorId: req.user.id,
      sellerId,
      amount,
      returnPercentage: DEFAULT_RETURN_PERCENTAGE,
      maturityDate,
      returnAmount: Number((amount + profitEarned).toFixed(2)),
      profitEarned,
      description: `Three-month rural farm working-capital contribution for ${seller.sellerProfile.farmName || seller.name}.`,
    }, { transaction });

    const profile = seller.sellerProfile;
    profile.totalInvestmentReceived = Number(profile.totalInvestmentReceived || 0) + amount;
    profile.availableBalance = Number(profile.availableBalance || 0) + amount;
    await profile.save({ transaction });

    await Transaction.create({
      userId: req.user.id,
      type: 'investment_made',
      amount: -amount,
      balanceBefore: 0,
      balanceAfter: -amount,
      referenceId: investment.id,
      referenceType: 'investment',
      description: `Investment in ${profile.farmName || seller.name}`,
    }, { transaction });
    await Transaction.create({
      userId: sellerId,
      type: 'investment_received',
      amount,
      balanceBefore: Number(profile.availableBalance || 0),
      balanceAfter: Number(profile.availableBalance || 0) + amount,
      referenceId: investment.id,
      referenceType: 'investment',
      description: 'Working capital received from consumer investor',
    }, { transaction });

    await transaction.commit();
    res.status(201).json({
      ...serialize(investment),
      sellerName: profile.farmName || seller.name,
      message: 'Investment recorded. Returns are payable at maturity subject to the published terms.',
    });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ message: error.message });
  }
};

const getPortfolio = async (req, res) => {
  try {
    const investments = await Investment.findAll({
      where: { investorId: req.user.id },
      order: [['investedAt', 'DESC']],
      include: [{ model: User, as: 'seller', attributes: ['id', 'name', 'village', 'district'] }],
    });
    const rows = investments.map(serialize);
    res.json({
      investments: rows,
      summary: {
        invested: rows.reduce((sum, item) => sum + Number(item.amount || 0), 0),
        projectedReturns: rows.reduce((sum, item) => sum + Number(item.returnAmount || 0), 0),
        projectedProfit: rows.reduce((sum, item) => sum + Number(item.profitEarned || 0), 0),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getInvestmentOpportunities, createInvestment, getPortfolio };
