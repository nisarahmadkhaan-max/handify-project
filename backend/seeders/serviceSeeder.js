const mongoose = require('mongoose');
const Service = require('../models/Service');

const services = [
  // Plumbing
  { name: 'Leak Repair', description: 'Fix leaking pipes and faucets', imageUrl: 'assets/cat1.png', category: 'Plumbing', price: 75 },
  { name: 'Drain Cleaning', description: 'Professional drain cleaning and unclogging', imageUrl: 'assets/cat2.png', category: 'Plumbing', price: 100 },
  { name: 'Toilet Repair', description: 'Fix flushing issues and toilet leaks', imageUrl: 'assets/cat1.png', category: 'Plumbing', price: 90 },
  { name: 'Geyser Service', description: 'Installation and repair of gas/electric geysers', imageUrl: 'assets/cat1.png', category: 'Plumbing', price: 150 },
  { name: 'Water Tank Cleaning', description: 'Thorough cleaning of overhead and ground tanks', imageUrl: 'assets/cat2.png', category: 'Plumbing', price: 250 },
  { name: 'Kitchen Tap Fix', description: 'Repairing or replacing kitchen mixers and taps', imageUrl: 'assets/cat1.png', category: 'Plumbing', price: 60 },

  // Electrical
  { name: 'Electrical Repairs', description: 'General electrical repair and maintenance', imageUrl: 'assets/cat1.png', category: 'Electrical', price: 120 },
  { name: 'Fan Installation', description: 'Installation of ceiling and bracket fans', imageUrl: 'assets/cat2.png', category: 'Electrical', price: 50 },
  { name: 'Circuit Breaker Fix', description: 'Repairing or replacing faulty circuit breakers', imageUrl: 'assets/cat1.png', category: 'Electrical', price: 150 },
  { name: 'AC Service', description: 'General AC service and gas charging', imageUrl: 'assets/cat2.png', category: 'Electrical', price: 200 },
  { name: 'UPS Repair', description: 'Fixing UPS and battery maintenance', imageUrl: 'assets/cat1.png', category: 'Electrical', price: 180 },
  { name: 'House Wiring', description: 'Complete or partial house electrical wiring', imageUrl: 'assets/cat2.png', category: 'Electrical', price: 500 },

  // House Keeping
  { name: 'Regular Cleaning', description: 'Weekly or monthly house cleaning services', imageUrl: 'assets/cat1.png', category: 'House Keeping', price: 80 },
  { name: 'Deep Cleaning', description: 'Thorough cleaning of every corner of your home', imageUrl: 'assets/cat2.png', category: 'House Keeping', price: 200 },
  { name: 'Sofa Cleaning', description: 'Vacuuming and shampooing sofa sets', imageUrl: 'assets/cat1.png', category: 'House Keeping', price: 100 },
  { name: 'Pest Control', description: 'Fumigation and pest control treatment', imageUrl: 'assets/cat2.png', category: 'House Keeping', price: 150 },
  { name: 'Carpet Cleaning', description: 'Deep cleaning and washing of carpets', imageUrl: 'assets/cat1.png', category: 'House Keeping', price: 120 },
  { name: 'Water Tank Wash', description: 'Specialized cleaning for water storage', imageUrl: 'assets/cat2.png', category: 'House Keeping', price: 180 },

  // Painting
  { name: 'Interior Painting', description: 'Professional interior wall painting', imageUrl: 'assets/cat1.png', category: 'Painting', price: 100 },
  { name: 'Exterior Painting', description: 'High-quality weather-proof exterior painting', imageUrl: 'assets/cat2.png', category: 'Painting', price: 300 },
  { name: 'Door Polishing', description: 'Polishing and shining wooden doors', imageUrl: 'assets/cat1.png', category: 'Painting', price: 120 },
  { name: 'Wall Stencil', description: 'Decorative stencil work and wall art', imageUrl: 'assets/cat2.png', category: 'Painting', price: 150 },
  { name: 'Waterproofing', description: 'Roof and wall leakage/seepage treatment', imageUrl: 'assets/cat1.png', category: 'Painting', price: 400 },
  { name: 'Wood Lacquer', description: 'Premium lacquer finish for furniture', imageUrl: 'assets/cat2.png', category: 'Painting', price: 250 },

  // Carpentry
  { name: 'Custom Furniture', description: 'Custom wood furniture and cabinetry', imageUrl: 'assets/cat1.png', category: 'Carpentry', price: 300 },
  { name: 'Door Repair', description: 'Fixing hinges, locks, and broken doors', imageUrl: 'assets/cat2.png', category: 'Carpentry', price: 70 },
  { name: 'Lock Installation', description: 'Smart and traditional lock installation', imageUrl: 'assets/cat1.png', category: 'Carpentry', price: 50 },
  { name: 'Wardrobe Fix', description: 'Repairing cabinets, drawers and wardrobes', imageUrl: 'assets/cat2.png', category: 'Carpentry', price: 120 },
  { name: 'Kitchen Cabinet', description: 'Installation and repair of kitchen wood work', imageUrl: 'assets/cat1.png', category: 'Carpentry', price: 350 },
  { name: 'Wood Polishing', description: 'Refreshing the look of your wooden items', imageUrl: 'assets/cat2.png', category: 'Carpentry', price: 100 },

  // Welding
  { name: 'Metal Fabrication', description: 'Custom metal fabrication and welding services', imageUrl: 'assets/cat1.png', category: 'Welding', price: 120 },
  { name: 'Gate Repair', description: 'Welding and fixing iron gates', imageUrl: 'assets/cat2.png', category: 'Welding', price: 150 },
  { name: 'Window Grills', description: 'Installation and repair of window safety grills', imageUrl: 'assets/cat1.png', category: 'Welding', price: 180 },
  { name: 'Iron Staircase', description: 'Manufacturing of durable iron stairs', imageUrl: 'assets/cat2.png', category: 'Welding', price: 600 },
  { name: 'Shed Installation', description: 'Metal shed for parking or terraces', imageUrl: 'assets/cat1.png', category: 'Welding', price: 450 },
  { name: 'Welding Fixes', description: 'Minor welding and metal joinery works', imageUrl: 'assets/cat2.png', category: 'Welding', price: 50 }
];

const seedServices = async () => {
  try {
    await Service.deleteMany({});
    await Service.insertMany(services);
    console.log('✅ Services re-seeded with extensive data (6+ items per category)');
  } catch (error) {
    console.error('Error seeding services:', error);
  }
};

module.exports = seedServices;
