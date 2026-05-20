const express = require('express');
const router = express.Router();
const contactSupportController = require('../controllers/contactSupportController');

// POST /api/contact-support
router.post('/', contactSupportController.createSupportRequest);

module.exports = router; 