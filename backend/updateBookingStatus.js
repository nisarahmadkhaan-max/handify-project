require('dotenv').config();
const mongoose = require('mongoose');
const Booking = require('./models/Booking');

// Connect to MongoDB using the same method as server.js
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/myionicapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 10000,
  retryWrites: true,
  w: 'majority'
});

async function updateBookingStatus() {
  try {
    console.log('Updating booking statuses...');
    
    // Find all bookings without a status or with null/undefined status
    const bookingsToUpdate = await Booking.find({
      $or: [
        { status: { $exists: false } },
        { status: null },
        { status: undefined }
      ]
    });
    
    console.log(`Found ${bookingsToUpdate.length} bookings to update`);
    
    if (bookingsToUpdate.length > 0) {
      // Update all bookings to have 'pending' status
      const result = await Booking.updateMany(
        {
          $or: [
            { status: { $exists: false } },
            { status: null },
            { status: undefined }
          ]
        },
        { $set: { status: 'pending' } }
      );
      
      console.log(`Updated ${result.modifiedCount} bookings`);
    }
    
    // Also update any bookings with invalid status values
    const invalidStatusBookings = await Booking.find({
      status: { $nin: ['pending', 'confirmed', 'cancelled'] }
    });
    
    console.log(`Found ${invalidStatusBookings.length} bookings with invalid status`);
    
    if (invalidStatusBookings.length > 0) {
      const result = await Booking.updateMany(
        { status: { $nin: ['pending', 'confirmed', 'cancelled'] } },
        { $set: { status: 'pending' } }
      );
      
      console.log(`Updated ${result.modifiedCount} bookings with invalid status`);
    }
    
    console.log('Status update completed successfully');
  } catch (error) {
    console.error('Error updating booking statuses:', error);
  } finally {
    mongoose.connection.close();
  }
}

updateBookingStatus(); 