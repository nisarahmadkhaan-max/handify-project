const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Employee = require('../models/Employee');
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

// Signup route for regular users
router.post('/signup', async (req, res) => {
  try {
    const { fullName, email, phoneNumber, password, location } = req.body;
    const existingUser = await User.findOne({ $or: [{ email }, { phoneNumber }] });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const user = new User({ fullName, email, phoneNumber, password, role: 'user', location: location || '' });
    await user.save();

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '7d' });

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        location: user.location,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Employee Signup Route
router.post('/employee-signup', async (req, res) => {
  try {
    const {
      fullName, email, phoneNumber, password,
      specialization, availability,
      cnicFront, cnicBack,
      emergencyContact, location
    } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { phoneNumber }] });
    if (existingUser) return res.status(400).json({ message: 'Account with this email/phone already exists' });

    const user = new User({
      fullName, email, phoneNumber, password, role: 'employee', location: location || ''
    });
    await user.save();

    const employee = new Employee({
      userId: user._id,
      name: fullName,
      service: specialization,
      availability: availability || [],
      cnic: { frontImage: cnicFront, backImage: cnicBack },
      emergencyContact: emergencyContact,
      isAvailable: true,
      isVerified: false
    });
    await employee.save();

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '7d' });

    res.status(201).json({
      success: true,
      message: 'Employee account created and pending verification',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        location: user.location,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Login route with Verification Check
router.post('/login', async (req, res) => {
  try {
    const { email, phoneNumber, password } = req.body;

    let user = email ? await User.findOne({ email }) : await User.findOne({ phoneNumber });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if user is an Employee and is Verified
    if (user.role === 'employee') {
      const employee = await Employee.findOne({ userId: user._id });
      if (!employee || !employee.isVerified) {
        return res.status(403).json({ message: 'Please verify your self' });
      }
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '7d' });
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        location: user.location,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/profile', auth, userController.updateProfile);
module.exports = router;
