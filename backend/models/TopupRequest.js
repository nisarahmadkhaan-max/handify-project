const mongoose = require('mongoose');

const topupRequestSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  transactionId: {
    type: String,
    required: true
  },
  screenshot: {
    type: String, // Base64 or URL
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  adminNotes: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('TopupRequest', topupRequestSchema);