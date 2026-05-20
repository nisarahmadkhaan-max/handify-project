// routes/requestRoutes.js

const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');
const Booking = require('../models/Booking');
const auth = require('../middleware/auth');

// Admin: Get all requests (React Admin compatible) - using Booking data
router.get('/requests', async (req, res) => {
  try {
    // Get all bookings with complete data and populated user information
    const bookings = await Booking.find({})
      .sort({ createdAt: -1 }) // Sort by creation date descending (newest first)
      .populate('userId', 'fullName email phoneNumber'); // Populate user details
    
    // Return complete booking data
    const requests = bookings.map(booking => ({
      // Complete booking data
      _id: booking._id,
      category: booking.category,
      service: booking.service,
      estimatedCost: booking.estimatedCost,
      date: booking.date,
      time: booking.time,
      location: booking.location,
      additionalInstructions: booking.additionalInstructions,
      status: booking.status,
      userId: booking.userId,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
      __v: booking.__v,
      
      // Additional formatted fields for frontend compatibility
      id: booking._id.toString(),
      serviceName: booking.service,
      formattedStatus: booking.status.charAt(0).toUpperCase() + booking.status.slice(1),
      dateTime: `${booking.date}, ${booking.time}`,
      bookingId: `#${booking._id.toString().slice(-6)}`,
      
      // User information
      user: booking.userId
    }));
    
    // Set the total count in Content-Range header
    const total = requests.length;
    res.set('Content-Range', `requests 0-${total - 1}/${total}`);
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// User: Get only the authenticated user's requests
router.get('/my-requests', auth, requestController.getMyRequests);

router.get('/requests/:id', requestController.getRequestById);

module.exports = router; 