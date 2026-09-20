const express = require('express');
const router = express.Router();
const { Village } = require('../models');

router.get('/villages', async (req, res) => {
  try {
    const where = {};
    if (req.query.district) where.district = req.query.district;
    if (req.query.pincode) where.pincode = req.query.pincode;
    const villages = await Village.findAll({ where, order: [['name', 'ASC']] });
    res.json(villages.map((village) => ({ ...village.toJSON(), _id: village.id })));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
