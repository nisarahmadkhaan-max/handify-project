const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const Notification = require('../models/Notification');

// Get all notifications (React Admin compatible)
router.get('/', async (req, res) => {
  try {
    const filter = req.query.filter ? JSON.parse(req.query.filter) : {};
    const range = req.query.range ? JSON.parse(req.query.range) : [0, 9];
    const sort = req.query.sort ? JSON.parse(req.query.sort) : ['_id', 'ASC'];
    const sortField = sort[0];
    const sortOrder = sort[1] === 'ASC' ? 1 : -1;
    const skip = range[0];
    const limit = range[1] - range[0] + 1;
    const total = await Notification.countDocuments(filter);
    const notifications = await Notification.find(filter)
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(limit);
    res.set('Content-Range', `notifications ${skip}-${skip + notifications.length - 1}/${total}`);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 