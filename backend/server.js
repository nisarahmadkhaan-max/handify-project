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

app.use(express.json({ limit: '50mb' })); // Increased limit for base64 images
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve Static Files (Important for seeder images)
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Routes
app.get('/', (req, res) => res.send('Server is running'));
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

const mongoUri = process.env.MONGODB_URI;
const enableAutoSeed = process.env.ENABLE_AUTO_SEED === 'true';

if (mongoUri) {
  mongoose.connect(mongoUri)
  .then(async () => {
    console.log('⭐⭐⭐ SUCCESS: Connected to MongoDB ⭐⭐⭐');
    if (enableAutoSeed) {
      await seedAdmin();
      await seedCategories();
      await seedServices();
      await seedEmployees();
      await seedSettings();
    }
  })
  .catch(err => {
    console.error('❌ MONGODB CONNECTION ERROR:', err.message);
  });
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
