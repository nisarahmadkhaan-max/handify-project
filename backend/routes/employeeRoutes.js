const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// Public route for employee self-registration
router.post('/register', employeeController.registerEmployee);

// Logged in employee profile
router.get('/profile', auth, employeeController.getEmployeeProfile);

// Admin routes for employees
router.post('/', auth, admin, employeeController.createEmployee);
router.get('/', auth, admin, employeeController.getEmployees);
router.get('/:id', auth, admin, employeeController.getEmployee);
router.put('/:id', auth, admin, employeeController.updateEmployee);
router.delete('/:id', auth, admin, employeeController.deleteEmployee);

module.exports = router;
