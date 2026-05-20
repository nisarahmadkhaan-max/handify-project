const Booking = require('../models/Booking');
const User = require('../models/User');

const seedBookings = async () => {
  try {
    // Get a user to associate with bookings
    const user = await User.findOne();
    
    if (!user) {
      console.log('No user found. Please create a user first.');
      return;
    }

    const bookings = [
      {
        category: 'Cleaning',
        service: 'House Cleaning',
        estimatedCost: 150,
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        time: '10:00',
        location: '123 Main St, City, State',
        additionalInstructions: 'Please bring cleaning supplies',
        status: 'pending',
        userId: user._id
      },
      {
        category: 'Plumbing',
        service: 'Pipe Repair',
        estimatedCost: 200,
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        time: '14:30',
        location: '456 Oak Ave, City, State',
        additionalInstructions: 'Kitchen sink is leaking',
        status: 'pending',
        userId: user._id
      },
      {
        category: 'Electrical',
        service: 'Light Installation',
        estimatedCost: 100,
        date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
        time: '09:00',
        location: '789 Pine Rd, City, State',
        additionalInstructions: 'Need new ceiling lights installed',
        status: 'confirmed',
        userId: user._id
      },
      {
        category: 'Gardening',
        service: 'Lawn Maintenance',
        estimatedCost: 80,
        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        time: '16:00',
        location: '321 Elm St, City, State',
        additionalInstructions: 'Front yard needs mowing and trimming',
        status: 'cancelled',
        userId: user._id
      }
    ];

    // Clear existing bookings
    await Booking.deleteMany({});
    
    // Insert new bookings
    const createdBookings = await Booking.insertMany(bookings);
    
    console.log(`Created ${createdBookings.length} test bookings`);
    
    return createdBookings;
  } catch (error) {
    console.error('Error seeding bookings:', error);
    throw error;
  }
};

module.exports = seedBookings; 