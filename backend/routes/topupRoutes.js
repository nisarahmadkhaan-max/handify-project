const express = require('express');
const router = express.Router();
const topupController = require('../controllers/topupController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// Employee: Submit top-up
router.post('/request', auth, topupController.submitTopupRequest);

// Admin: Get all requests
router.get('/requests', auth, admin, topupController.getAllTopupRequests);

// Admin: Get single request (Add this)
router.get('/requests/:id', auth, admin, topupController.getTopupRequestById);

// Admin: Approve/Reject
router.patch('/requests/:id', auth, admin, topupController.updateTopupStatus);

module.exports = router;