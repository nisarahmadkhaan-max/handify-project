const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Employee = require('../models/Employee');
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const twilio = require('twilio');

// Twilio Setup (Optional: requires credentials in .env)
const client = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null;

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

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, phoneNumber, password } = req.body;
    const phoneRegex = /^[0-9]{11}$/;

    // Added 11-digit check for login as well
    if (phoneNumber && !phoneRegex.test(phoneNumber)) {
        return res.status(400).json({ message: 'Please insert your valid 11-digit number' });
    }

    let user = email ? await User.findOne({ email }) : await User.findOne({ phoneNumber });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

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

// FORGOT PASSWORD - Generate and Send OTP
router.post('/forgot-password', async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    const user = await User.findOne({ phoneNumber });

    if (!user) {
      return res.status(404).json({ message: 'User not found with this number' });
    }

    // Generate 4 digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60000); // 10 minutes expiry

    user.resetPasswordOTP = { code: otp, expiresAt };
    await user.save();

    console.log(`🔑 OTP for ${phoneNumber}: ${otp}`); // For debugging/demo

    // Send SMS via Twilio if configured
    if (client) {
      try {
        await client.messages.create({
          body: `Your Handify password reset code is: ${otp}`,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: `+92${phoneNumber.substring(1)}` // Pakistani format
        });
      } catch (err) {
        console.error('Twilio Error:', err.message);
      }
    }

    res.json({ message: 'OTP sent successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// RESET PASSWORD - Verify OTP and update password
router.post('/reset-password', async (req, res) => {
  try {
    const { phoneNumber, otp, newPassword } = req.body;
    const user = await User.findOne({ phoneNumber });

    if (!user || !user.resetPasswordOTP || user.resetPasswordOTP.code !== otp) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    if (new Date() > user.resetPasswordOTP.expiresAt) {
      return res.status(400).json({ message: 'OTP has expired' });
    }

    // Update password
    user.password = newPassword; // Model will hash it on save
    user.resetPasswordOTP = undefined; // Clear OTP
    await user.save();

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/profile', auth, userController.updateProfile);
module.exports = router;
