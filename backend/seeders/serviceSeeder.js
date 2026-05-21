const mongoose = require('mongoose');
const Service = require('../models/Service');

const services = [
  // Plumbing
  { name: 'Leak Repair', description: 'Fix leaking pipes and faucets', imageUrl: 'assets/cat1.png', category: 'Plumbing', price: 75 },
  { name: 'Drain Cleaning', description: 'Professional drain cleaning and unclogging', imageUrl: 'assets/cat2.png', category: 'Plumbing', price: 100 },
  { name: 'Toilet Repair', description: 'Fix flushing issues and toilet leaks', imageUrl: 'assets/cat1.png', category: 'Plumbing', price: 90 },

  // Electrical
  { name: 'Electrical Repairs', description: 'General electrical repair and maintenance', imageUrl: 'assets/cat1.png', category: 'Electrical', price: 120 },
  { name: 'Fan Installation', description: 'Installation of ceiling and bracket fans', imageUrl: 'assets/cat2.png', category: 'Electrical', price: 50 },
  { name: 'Circuit Breaker Fix', description: 'Repairing or replacing faulty circuit breakers', imageUrl: 'assets/cat1.png', category: 'Electrical', price: 150 },

  // House Keeping
  { name: 'Regular Cleaning', description: 'Weekly or monthly house cleaning services', imageUrl: 'assets/cat1.png', category: 'House Keeping', price: 80 },
  { name: 'Deep Cleaning', description: 'Thorough cleaning of every corner of your home', imageUrl: 'assets/cat2.png', category: 'House Keeping', price: 200 },
  { name: 'Sofa Cleaning', description: 'Vacuuming and shampooing sofa sets', imageUrl: 'assets/cat1.png', category: 'House Keeping', price: 100 },

  // Painting
  { name: 'Interior Painting', description: 'Professional interior wall painting', imageUrl: 'assets/cat1.png', category: 'Painting', price: 100 },
  { name: 'Exterior Painting', description: 'High-quality weather-proof exterior painting', imageUrl: 'assets/cat2.png', category: 'Painting', price: 300 },
  { name: 'Door Polishing', description: 'Polishing and shining wooden doors', imageUrl: 'assets/cat1.png', category: 'Painting', price: 120 },

  // Carpentry
  { name: 'Custom Furniture', description: 'Custom wood furniture and cabinetry', imageUrl: 'assets/cat1.png', category: 'Carpentry', price: 300 },
  { name: 'Door Repair', description: 'Fixing hinges, locks, and broken doors', imageUrl: 'assets/cat2.png', category: 'Carpentry', price: 70 },
  { name: 'Lock Installation', description: 'Smart and traditional lock installation', imageUrl: 'assets/cat1.png', category: 'Carpentry', price: 50 },

  // Welding
  { name: 'Metal Fabrication', description: 'Custom metal fabrication and welding services', imageUrl: 'assets/cat1.png', category: 'Welding', price: 120 },
  { name: 'Gate Repair', description: 'Welding and fixing iron gates', imageUrl: 'assets/cat2.png', category: 'Welding', price: 150 },
  { name: 'Window Grills', description: 'Installation and repair of window safety grills', imageUrl: 'assets/cat1.png', category: 'Welding', price: 180 }
];

const seedServices = async () => {
  try {
    // We clear existing services and re-seed to get the new list
    await Service.deleteMany({});
    await Service.insertMany(services);
    console.log('✅ Services re-seeded with multiple items per category');
  } catch (error) {
    console.error('Error seeding services:', error);
  }
};

module.exports = seedServices;
