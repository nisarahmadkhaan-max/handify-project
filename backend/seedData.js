require('dotenv').config();
const mongoose = require('mongoose');
const seedCategories = require('./seeders/categorySeeder');
const seedServices = require('./seeders/serviceSeeder');
const seedBookings = require('./seeders/bookingSeeder');
const seedAdmin = require('./seeders/adminSeeder');

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 10000,
  retryWrites: true,
  w: 'majority'
})
.then(async () => {
  console.log('Connected to MongoDB');
  // Seed data after successful connection
  await seedAdmin();
  await seedCategories();
  await seedServices();
  await seedBookings();
  console.log('Seeding completed successfully');
  process.exit(0);
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
}); 