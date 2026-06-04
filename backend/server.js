require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const Booking = require('./models/Booking');
const seedAdmin = require('./seeders/adminSeeder');
const seedCategories = require('./seeders/categorySeeder');
const seedServices = require('./seeders/serviceSeeder');
const seedSettings = require('./seeders/settingsSeeder');

const app = express();
let lastError = null;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Database Connection Logic
const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    lastError = "MONGODB_URI is missing in Vercel Environment Variables";
    return;
  }

  try {
    console.log("Attempting to connect to MongoDB...");
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000, // 10 seconds timeout
    });
    lastError = null;
    console.log("DB Connected Successfully");
  } catch (err) {
    lastError = err.message;
    console.error("DB Connection Error:", err.message);
  }
};

// Root Route - Detailed Status
app.get('/', async (req, res) => {
  await connectDB(); // Try connecting on request
  const state = mongoose.connection.readyState;
  const states = ["Disconnected", "Connected", "Connecting...", "Disconnecting"];

  res.json({
    message: "Handify API Status",
    db_status: states[state] || "Unknown",
    error: lastError,
    hint: lastError ? "Check if your DB password contains special characters. If yes, encode them (e.g., @ becomes %40)" : "None"
  });
});

app.use(async (req, res, next) => {
  await connectDB();
  next();
});

app.get('/api/force-seed', async (req, res) => {
    try {
      if (mongoose.connection.readyState !== 1) {
          return res.status(503).json({ error: "DB not connected", details: lastError });
      }
      await seedAdmin();
      await seedCategories();
      await seedServices();
      await seedSettings();
      await Booking.deleteMany({});
      res.json({ message: "Seeded Successfully!" });
    } catch (err) {
      res.status(500).json({ error: "Seed failed", details: err.message });
    }
});

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

module.exports = app;
