const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const Employee = require('../models/Employee');
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

// Nodemailer Setup for Email OTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail
    pass: process.env.EMAIL_PASS  // Your App Password
  }
});

// Signup route
router.post('/signup', async (req, res) => {
  try {
    const { fullName, email, phoneNumber, password, location } = req.body;
    const existingUser = await User.findOne({ $or: [{ email }, { phoneNumber }] });
    if (existingUser) return res.status(400).json({ message: 'Account with this email/phone already exists' });

    const user = new User({ fullName, email, phoneNumber, password, role: 'user', location: location || '' });
    await user.save();

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '7d' });
    res.status(201).json({ message: 'User created successfully', token, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login route (Updated to support Email/Password)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !email.endsWith('@gmail.com')) {
      return res.status(400).json({ message: 'Please provide a valid Gmail address' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (user.role === 'employee') {
      const employee = await Employee.findOne({ userId: user._id });
      if (!employee || !employee.isVerified) {
        return res.status(403).json({ message: 'Please verify your self' });
      }
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '7d' });
    res.json({ message: 'Login successful', token, user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// FORGOT PASSWORD - Send OTP to Email (FREE)
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({ message: 'User not found with this email' });
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    user.resetPasswordOTP = { code: otp, expiresAt: new Date(Date.now() + 15 * 60000) };
    await user.save();

    // Send Email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Handify - Password Reset OTP',
      text: `Your OTP for password reset is: ${otp}. It will expire in 15 minutes.`
    };

    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      await transporter.sendMail(mailOptions);
      res.json({ message: 'OTP sent to your email' });
    } else {
      console.log('🔑 EMAIL OTP (Demo Mode):', otp);
      res.json({ message: 'OTP generated (Check server logs in demo mode)' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// RESET PASSWORD
router.post('/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user || !user.resetPasswordOTP || user.resetPasswordOTP.code !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (new Date() > user.resetPasswordOTP.expiresAt) {
      return res.status(400).json({ message: 'OTP has expired' });
    }

    user.password = newPassword;
    user.resetPasswordOTP = undefined;
    await user.save();

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/profile', auth, userController.updateProfile);
module.exports = router;
