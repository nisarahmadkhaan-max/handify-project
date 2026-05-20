const ChatMessage = require('../models/ChatMessage');

exports.sendMessage = async (req, res) => {
  try {
    const { bookingId, receiverId, text, type, audioLength } = req.body;
    const senderId = req.user._id;

    const message = new ChatMessage({
      bookingId,
      senderId,
      receiverId,
      text,
      type,
      audioLength
    });

    await message.save();
    res.status(201).json({ success: true, data: message });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { bookingId } = req.query;
    if (!bookingId) {
        return res.status(400).json({ success: false, message: 'Booking ID is required' });
    }

    const messages = await ChatMessage.find({ bookingId }).sort({ timestamp: 1 });
    res.json({ success: true, data: messages });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};