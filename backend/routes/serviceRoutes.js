const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// 1. Get all services (Admin list)
router.get('/', serviceController.getAllServices);

// 2. Get services by category (App uses this)
router.get('/category/:category', serviceController.getServicesByCategory);

// 3. Get single service (Specific ID must be after named routes)
router.get('/:id', serviceController.getService);

// Admin operations
router.post('/', auth, admin, serviceController.createService);
router.put('/:id', auth, admin, serviceController.updateService);
router.delete('/:id', auth, admin, serviceController.deleteService);

module.exports = router;
