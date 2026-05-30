const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  category: { type: String, required: true },
  service: { type: String, required: true },
  basePrice: { type: Number, required: true, default: 0 },
  commissionAmount: { type: Number, default: 0 },
  finalPrice: { type: Number, required: true, default: 0 },
  hourlyRate: { type: Number, default: 200 }, // Captured from service at time of booking
  date: { type: String, required: true },
  time: { type: String, required: true },
  location: { type: String, required: true },
  additionalInstructions: { type: String, default: '' },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in_progress', 'cancelled', 'completed'],
    default: 'pending'
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
  completionOTP: { type: String },

  // Time-based Tracking
  workStartTime: { type: Date },
  workEndTime: { type: Date },
  totalHoursWorked: { type: Number, default: 0 },
  extraTimeCharges: { type: Number, default: 0 },

  // Rating Fields
  rating: { type: Number, min: 0, max: 5, default: 0 },
  review: { type: String, default: '' }
}, {
  timestamps: true
});

module.exports = mongoose.model('Booking', bookingSchema);
