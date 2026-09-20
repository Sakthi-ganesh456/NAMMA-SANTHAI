const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

dotenv.config();

const { syncDatabase } = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const sellerRoutes = require('./routes/sellerRoutes');
const investmentRoutes = require('./routes/investmentRoutes');
const communityRoutes = require('./routes/communityRoutes');
const { seedDatabase } = require('./seed/seedData');

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Root / Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'Namm Sandei API (நம்ம சந்தை)',
    timestamp: new Date().toISOString(),
  });
});

// One-click Re-seed endpoint for convenience
app.post('/api/seed', async (req, res) => {
  try {
    await seedDatabase();
    res.json({ message: 'Catalog re-seeded successfully!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/seller', sellerRoutes);
app.use('/api/investments', investmentRoutes);
app.use('/api/community', communityRoutes);

// Error Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Database initialization & server start
syncDatabase().then(async () => {
  app.listen(PORT, () => {
    console.log(`🚀 Namm Sandei Backend Server running on port ${PORT}`);
    console.log(`📍 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`🥬 Products API: http://localhost:${PORT}/api/products`);
  });
});
