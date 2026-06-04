require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Basic Root Route (Checks DB status)
app.get('/', (req, res) => {
  res.json({
    message: "Handify API is Live!",
    db: mongoose.connection.readyState === 1 ? "Connected" : "Connecting..."
  });
});

// Database Connection
const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("DB Connected");
  } catch (err) {
    console.error("DB Error:", err.message);
  }
};

// Lazy Connection Middleware
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// Dynamic Route Loading with Error Catching
try {
  app.use('/api/auth', require('./routes/auth'));
  app.use('/api/categories', require('./routes/categoryRoutes'));
  app.use('/api/services', require('./routes/serviceRoutes'));
  app.use('/api/bookings', require('./routes/bookingRoutes'));
  app.use('/api/employees', require('./routes/employeeRoutes'));
  app.use('/api', require('./routes/requestRoutes'));
  app.use('/api/notifications', require('./routes/notificationRoutes'));
  app.use('/api/contact-support', require('./routes/contactSupportRoutes'));
  app.use('/api/chat', require('./routes/chatRoutes'));
  app.use('/api/users', require('./routes/userRoutes'));
  app.use('/api/wallet', require('./routes/topupRoutes'));
  app.use('/api/settings', require('./routes/settingsRoutes'));
} catch (error) {
  console.error("Critical Route Loading Error:", error.message);
}

// Global Error Handler
app.use((err, req, res, next) => {
  res.status(500).json({ error: "Internal Server Error", message: err.message });
});

module.exports = app;
