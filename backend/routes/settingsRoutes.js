const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// 1. Admin: Get all settings
router.get('/', auth, admin, settingsController.getAllSettings);

// 2. Admin: Get single setting by ID (Important for React Admin)
router.get('/id/:id', auth, admin, settingsController.getSettingById);

// 3. Admin: Update setting
router.put('/:id', auth, admin, settingsController.updateSetting);

// 4. Public/App: Get a specific setting by KEY
router.get('/key/:key', settingsController.getSettingByKey);

module.exports = router;