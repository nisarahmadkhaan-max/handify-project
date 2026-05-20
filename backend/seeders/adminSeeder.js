const User = require('../models/User');

const seedAdmin = async () => {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@gmail.com' });
    
    if (existingAdmin) {
      console.log('Admin user already exists');
      return existingAdmin;
    }

    // Create admin user
    const adminUser = new User({
      fullName: 'Admin User',
      email: 'admin@gmail.com',
      phoneNumber: '1234567890',
      password: 'admin123',
      role: 'admin'
    });

    const savedAdmin = await adminUser.save();
    console.log('Admin user created successfully');
    
    return savedAdmin;
  } catch (error) {
    console.error('Error seeding admin:', error);
    throw error;
  }
};

module.exports = seedAdmin; 