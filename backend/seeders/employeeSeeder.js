const Employee = require('../models/Employee');
const User = require('../models/User');

const seedEmployees = async () => {
  try {
    // 1. Pehle purane dummy employees aur unke users ko clear karein
    // Taaki duplicate email ka error na aaye
    const existingSeedUsers = await User.find({ email: { $regex: '@handify.com$' } });
    const seedUserIds = existingSeedUsers.map(u => u._id);

    await Employee.deleteMany({ userId: { $in: seedUserIds } });
    await User.deleteMany({ email: { $regex: '@handify.com$' } });

    const availability = [
      { day: 'monday', startTime: '09:00', endTime: '18:00' },
      { day: 'tuesday', startTime: '09:00', endTime: '18:00' },
      { day: 'wednesday', startTime: '09:00', endTime: '18:00' },
      { day: 'thursday', startTime: '09:00', endTime: '18:00' },
      { day: 'friday', startTime: '09:00', endTime: '18:00' },
      { day: 'saturday', startTime: '09:00', endTime: '18:00' },
      { day: 'sunday', startTime: '09:00', endTime: '18:00' }
    ];

    const servicesList = [
      'Plumbing', 'Electrical', 'Carpentry', 'Painting', 'House Keeping', 'Welding'
    ];

    console.log('Creating seed users and employees...');

    for (let i = 0; i < servicesList.length; i++) {
      const serviceName = servicesList[i];
      const email = `expert${i}@handify.com`;
      const phone = `0300${String(i).padStart(7, '1')}`;

      // 2. Create a User for this employee
      const user = new User({
        fullName: `${serviceName} Expert`,
        email: email,
        phoneNumber: phone,
        password: 'password123',
        role: 'employee'
      });
      await user.save();

      // 3. Create the Employee profile linked to this User
      const employee = new Employee({
        userId: user._id,
        name: user.fullName,
        service: serviceName,
        availability,
        isAvailable: true,
        isVerified: true, // Dummy experts are pre-verified
        cnic: {
          frontImage: 'assets/imgs/cnic-front-placeholder.png',
          backImage: 'assets/imgs/cnic-back-placeholder.png'
        }
      });
      await employee.save();
    }

    console.log(`Successfully seeded ${servicesList.length} employees with their user accounts.`);
  } catch (error) {
    console.error('Error seeding employees:', error);
  }
};

module.exports = seedEmployees;
