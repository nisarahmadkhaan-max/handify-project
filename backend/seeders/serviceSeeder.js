const mongoose = require('mongoose');
const Service = require('../models/Service');

const services = [
  { name: 'Leak Repair', description: 'Fix leaking pipes and faucets', imageUrl: 'assets/cat1.png', category: 'Plumbing', price: 75 },
  { name: 'Drain Cleaning', description: 'Professional drain cleaning and unclogging services', imageUrl: 'assets/cat2.png', category: 'Plumbing', price: 100 },
  { name: 'Metal Fabrication', description: 'Custom metal fabrication and welding services', imageUrl: 'assets/cat1.png', category: 'Welding', price: 120 },
  { name: 'Regular Cleaning', description: 'Weekly or monthly house cleaning services', imageUrl: 'assets/cat1.png', category: 'House Keeping', price: 80 },
  { name: 'Interior Painting', description: 'Professional interior wall painting', imageUrl: 'assets/cat1.png', category: 'Painting', price: 100 },
  { name: 'Electrical Repairs', description: 'General electrical repair and maintenance', imageUrl: 'assets/cat1.png', category: 'Electrical', price: 120 },
  { name: 'Custom Furniture', description: 'Custom wood furniture and cabinetry', imageUrl: 'assets/cat1.png', category: 'Carpentry', price: 300 }
];

const seedServices = async () => {
  try {
    const count = await Service.countDocuments();
    if (count === 0) {
      await Service.insertMany(services);
      console.log('✅ Services seeded (Initial Setup)');
    } else {
      console.log('ℹ️ Services already exist, skipping seed to preserve admin changes.');
    }
  } catch (error) {
    console.error('Error seeding services:', error);
  }
};

module.exports = seedServices;
