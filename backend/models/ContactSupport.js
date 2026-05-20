const mongoose = require('mongoose');

const ContactSupportSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  message: { type: String, required: true },
  // Optionally, add user info if you want to associate requests with users
  // user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ContactSupport', ContactSupportSchema); 