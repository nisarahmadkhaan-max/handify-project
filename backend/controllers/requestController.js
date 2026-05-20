// controllers/requestController.js
const Booking = require('../models/Booking');

exports.getRequests = async (req, res) => {
  try {
    const bookings = await Booking.find();
    const requests = bookings.map(booking => ({
      id: booking._id.toString(),
      serviceName: booking.service,
      status: booking.status.charAt(0).toUpperCase() + booking.status.slice(1),
      dateTime: `${booking.date}, ${booking.time}`,
      bookingId: `#${booking._id.toString().slice(-6)}` // last 6 chars for brevity
    }));
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch requests', error: err.message });
  }
};

exports.getMyRequests = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .sort({ createdAt: -1 }) // Sort by creation date descending (newest first)
      .populate('userId', 'fullName email phoneNumber'); // Populate user details
    
    // Return complete booking data with additional formatted fields
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
    
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch requests', error: err.message });
  }
};

exports.getRequestById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('userId', 'fullName email phoneNumber');
    if (!booking) {
      return res.status(404).json({ message: 'Request not found' });
    }
    // Return the full booking object with populated user data
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch request', error: err.message });
  }
}; 