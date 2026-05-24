const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const Employee = require('../models/Employee');
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

router.post('/signup', async (req, res) => {
  try {
    let { fullName, email, phoneNumber, password, location } = req.body;
    email = email.trim().toLowerCase();

    const existingUser = await User.findOne({ $or: [{ email }, { phoneNumber }] });
    if (existingUser) return res.status(400).json({ message: 'Account already exists' });

    const user = new User({ fullName, email, phoneNumber, password, role: 'user', location: location || '' });
    await user.save();

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '7d' });
    res.status(201).json({ message: 'User created successfully', token, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    let { email, password } = req.body;
    email = email.trim().toLowerCase();

    const user = await User.findOne({ email });
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
    res.json({ message: 'Login successful', token, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/forgot-password', async (req, res) => {
  try {
    let { email } = req.body;
    email = email.trim().toLowerCase(); // Removing spaces

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found with this email' });
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    user.resetPasswordOTP = { code: otp, expiresAt: new Date(Date.now() + 15 * 60000) };
    await user.save();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Handify - OTP Code',
      text: `Your OTP is: ${otp}`
    };

    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      await transporter.sendMail(mailOptions);
      res.json({ message: 'OTP sent to your email' });
    } else {
      res.status(500).json({ message: 'Email service not configured' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/reset-password', async (req, res) => {
  try {
    let { email, otp, newPassword } = req.body;
    email = email.trim().toLowerCase();

    const user = await User.findOne({ email });

    if (!user || !user.resetPasswordOTP || user.resetPasswordOTP.code !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
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
