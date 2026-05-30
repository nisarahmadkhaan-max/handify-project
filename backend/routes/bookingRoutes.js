const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// Admin: Get ALL bookings for the admin panel
router.get('/', auth, admin, bookingController.getAllBookings);

// User: Create a new booking
router.post('/', auth, bookingController.createBooking);

// User/Employee: Get relevant bookings
router.get('/my-bookings', auth, bookingController.getBookings);

// Get a single booking by ID
router.get('/:id', auth, bookingController.getBooking);

// Employee: Accept a booking
router.post('/:id/accept', auth, bookingController.acceptBooking);

// Employee: Complete a booking (OTP required)
router.post('/:id/complete', auth, bookingController.completeBooking);

// User: Rate a completed booking
router.post('/:id/rate', auth, bookingController.rateBooking);

module.exports = router;