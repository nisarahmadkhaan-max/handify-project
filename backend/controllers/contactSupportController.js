const ContactSupport = require('../models/ContactSupport');

exports.createSupportRequest = async (req, res) => {
  try {
    const { subject, message } = req.body;
    if (!subject || !message) {
      return res.status(400).json({ error: 'Subject and message are required.' });
    }
    const supportRequest = new ContactSupport({ subject, message });
    await supportRequest.save();
    res.status(201).json({ message: 'Support request submitted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Server error.' });
  }
}; 