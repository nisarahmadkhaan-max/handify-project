require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

// Routes Imports
const authRoutes = require('./routes/auth');
const categoryRoutes = require('./routes/categoryRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const requestRoutes = require('./routes/requestRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const contactSupportRoutes = require('./routes/contactSupportRoutes');
const chatRoutes = require('./routes/chatRoutes');
const userRoutes = require('./routes/userRoutes');
const topupRoutes = require('./routes/topupRoutes');
const settingsRoutes = require('./routes/settingsRoutes');

// Seeders Imports
const seedAdmin = require('./seeders/adminSeeder');
const seedCategories = require('./seeders/categorySeeder');
const seedServices = require('./seeders/serviceSeeder');
const seedEmployees = require('./seeders/employeeSeeder');
const seedSettings = require('./seeders/settingsSeeder');

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Range', 'X-Total-Count']
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Basic Routes
app.get('/', (req, res) => res.send('Handify Backend is running!'));

// Database Connection Helper
const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;

  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error('❌ MONGODB_URI is missing in environment variables');
    return;
  }

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('⭐⭐⭐ SUCCESS: Connected to MongoDB ⭐⭐⭐');
  } catch (err) {
    console.error('❌ MONGODB CONNECTION ERROR:', err.message);
    throw err;
  }
};

// Debug/Seed Route
app.get('/api/force-seed', async (req, res) => {
  try {
    await connectDB();
    await seedAdmin();
    await seedCategories();
    await seedServices();
    await seedSettings();
    res.json({ message: 'Database Seeded Successfully! Admin is ready.' });
  } catch (err) {
    console.error('Seed Error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Middleware to ensure DB connection for all API routes
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({ error: 'Database connection failed' });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api', requestRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/contact-support', contactSupportRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/users', userRoutes);
app.use('/api/wallet', topupRoutes);
app.use('/api/settings', settingsRoutes);

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server is running on port ${PORT}`);
  });
}

module.exports = app;
