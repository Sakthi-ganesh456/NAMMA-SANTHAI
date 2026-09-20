const { Order, OrderItem, OrderTimeline, Product, Transaction, User } = require('../models');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  try {
    const {
      orderItems,
      deliveryAddress,
      deliverySlot,
      paymentMethod,
      paymentTiming,
      paymentReference,
      paymentConfirmed,
      notes,
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items provided' });
    }
    if (paymentMethod === 'UPI' && paymentTiming !== 'after_order' && !paymentConfirmed) {
      return res.status(400).json({ message: 'Please confirm that you paid using GPay before placing the order.' });
    }

    const itemsPrice = orderItems.reduce((acc, item) => acc + (Number(item.price) * Number(item.quantity)), 0);
    const deliveryPrice = itemsPrice >= 299 ? 0 : 30;
    const discountAmount = itemsPrice >= 500 ? 25 : 0;
    const totalPrice = Math.max(0, itemsPrice + deliveryPrice - discountAmount);

    // Platform logic: 90% to seller, 10% commission
    const platformCommission = itemsPrice * 0.10;
    const sellerEarnings = itemsPrice - platformCommission;

    const order = await Order.create({
      userId: req.user.id,
      deliveryAddress,
      deliverySlot: deliverySlot || { date: 'Today', time: 'Morning (6:00 AM - 9:00 AM)' },
      paymentMethod: paymentMethod || 'COD',
      paymentStatus: 'Pending',
      paymentTiming: paymentMethod === 'UPI' && paymentTiming === 'after_order' ? 'after_order' : 'before_order',
      paymentReference: paymentMethod === 'UPI' ? (paymentReference || '') : '',
      itemsPrice,
      deliveryPrice,
      discountAmount,
      totalPrice,
      sellerEarnings,
      platformCommission,
      notes: notes || '',
      orderStatus: 'Placed'
    });

    for (const item of orderItems) {
      // Find seller from product
      const p = await Product.findByPk(item.product || item.productId);
      const sellerId = p ? p.sellerId : null;
      
      await OrderItem.create({
        orderId: order.id,
        productId: p ? p.id : (item.product || item.productId),
        sellerId,
        name: item.name,
        tamilName: item.tamilName || '',
        image: item.image,
        price: item.price,
        quantity: item.quantity,
        unit: item.unit || '1 kg'
      });
      
      if (sellerId) {
        // Log transaction (for pending state, we might wait until 'Delivered', but recording it)
        await Transaction.create({
          userId: sellerId,
          type: 'sale_earning',
          amount: (item.price * item.quantity) * 0.90, // 90% split for this item
          referenceId: order.id,
          referenceType: 'order',
          description: `Sale from order #${order.id}`
        });
      }
    }

    await OrderTimeline.create({
      orderId: order.id,
      status: 'Placed',
      description: 'Order placed successfully. Farm fresh harvest scheduled.'
    });

    const data = order.toJSON();
    data._id = data.id;
    return res.status(201).json(data);
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: error.message || 'Failed to place order' });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
      include: [{ model: OrderItem, as: 'orderItems' }, { model: OrderTimeline, as: 'timeline' }]
    });
    return res.json(orders.map(o => { const d = o.toJSON(); d._id = d.id; return d; }));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        { model: User, as: 'user', attributes: ['name', 'email', 'phone'] },
        { model: OrderItem, as: 'orderItems' },
        { model: OrderTimeline, as: 'timeline' }
      ]
    });
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (order.userId !== req.user.id && req.user.role !== 'admin' && req.user.role !== 'seller') {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    const data = order.toJSON();
    data._id = data.id;
    return res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [{ model: User, as: 'user', attributes: ['name', 'email', 'phone'] }],
      order: [['createdAt', 'DESC']]
    });
    return res.json(orders.map(o => { const d = o.toJSON(); d._id = d.id; return d; }));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status, description } = req.body;
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.orderStatus = status;
    if (status === 'Delivered') order.paymentStatus = 'Paid';
    await order.save();

    await OrderTimeline.create({
      orderId: order.id,
      status,
      description: description || `Status updated to ${status}`
    });

    const data = order.toJSON();
    data._id = data.id;
    return res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const verifyOrderPayment = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.paymentMethod !== 'UPI') {
      return res.status(400).json({ message: 'Only GPay/UPI orders require payment verification.' });
    }
    order.paymentStatus = 'Paid';
    await order.save();
    const data = order.toJSON();
    data._id = data.id;
    return res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const submitPaymentReference = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.userId !== req.user.id) return res.status(403).json({ message: 'You can only update your own orders.' });
    if (order.paymentMethod !== 'UPI') return res.status(400).json({ message: 'Only GPay/UPI orders accept online payment references.' });
    const paymentReference = String(req.body.paymentReference || '').trim();
    if (!paymentReference) return res.status(400).json({ message: 'Please provide the GPay transaction reference or UTR.' });

    order.paymentReference = paymentReference;
    order.paymentTiming = 'after_order';
    order.paymentStatus = 'Pending';
    await order.save();
    const data = order.toJSON();
    data._id = data.id;
    return res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  verifyOrderPayment,
  submitPaymentReference,
};
