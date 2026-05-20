const Employee = require('../models/Employee');
const User = require('../models/User');
const nodemailer = require('nodemailer');
const Tesseract = require('tesseract.js');

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function verifyCnicWithOCR(base64Image, providedNumber) {
    try {
        console.log("--- Starting OCR Verification ---");
        const { data: { text } } = await Tesseract.recognize(base64Image, 'eng');
        const cleanExtracted = text.replace(/[^0-9]/g, '');
        const cleanProvided = providedNumber.replace(/[^0-9]/g, '');
        return cleanExtracted.includes(cleanProvided);
    } catch (error) {
        console.error("OCR Error:", error);
        return false;
    }
}

// Get logged-in employee profile
exports.getEmployeeProfile = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const employee = await Employee.findOne({ userId }).populate('userId', 'fullName email phoneNumber');
    if (!employee) return res.status(404).json({ success: false, message: 'Employee profile not found' });
    res.json({ success: true, data: employee });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Employee Registration Logic
exports.registerEmployee = async (req, res) => {
  try {
    const {
      username, email, phone, password, specialization,
      availableFrom, availableTo, cnicNumber, cnicFront, cnicBack, selfie,
      emergencyName, emergencyPhone
    } = req.body;

    // OCR Check
    const isCnicValid = await verifyCnicWithOCR(cnicFront, cnicNumber);
    if (!isCnicValid) {
        return res.status(400).json({
            success: false,
            message: 'The uploaded CNIC image appears to be blurry or the details do not match. Please provide a clear photo.'
        });
    }

    let user = await User.findOne({ $or: [{ email }, { phoneNumber: phone }] });

    if (user) {
      const existingEmployee = await Employee.findOne({ userId: user._id });
      if (existingEmployee) {
        return res.status(400).json({ success: false, message: 'This account is already registered as an employee' });
      }
      if (user.role === 'user') {
        user.role = 'employee';
        await user.save();
      }
    } else {
      user = new User({
        fullName: username,
        email,
        phoneNumber: phone,
        password,
        role: 'employee'
      });
      await user.save();
    }

    const employee = new Employee({
      userId: user._id,
      name: username,
      service: specialization,
      availability: [{
        day: 'monday',
        startTime: availableFrom || '09:00 AM',
        endTime: availableTo || '06:00 PM'
      }],
      cnic: {
        number: cnicNumber,
        frontImage: cnicFront,
        backImage: cnicBack,
        selfieWithCnic: selfie
      },
      emergencyContact: {
        name: emergencyName,
        phoneNumber: emergencyPhone
      },
      isVerified: true
    });
    await employee.save();

    res.status(201).json({
      success: true,
      message: 'Your account has been automatically verified. Welcome to Handify!',
      isVerified: true
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: Create Employee
exports.createEmployee = async (req, res) => {
  try {
    const employee = new Employee(req.body);
    await employee.save();
    res.status(201).json({ ...employee.toObject(), id: employee._id.toString() });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Get all employees
exports.getEmployees = async (req, res) => {
  try {
    let query = {};
    if (req.query.filter) {
      const filter = JSON.parse(req.query.filter);
      if (filter.q) query.name = { $regex: filter.q, $options: 'i' };
    }

    const range = req.query.range ? JSON.parse(req.query.range) : [0, 24];
    const total = await Employee.countDocuments(query);

    const employees = await Employee.find(query)
      .populate('userId', 'fullName email phoneNumber')
      .sort({ createdAt: -1 })
      .skip(range[0])
      .limit(range[1] - range[0] + 1)
      .lean();

    const mappedData = employees.map(emp => ({
      ...emp,
      id: emp._id.toString(),
      name: emp.name || (emp.userId ? emp.userId.fullName : 'Unknown')
    }));

    res.set('Content-Range', `employees ${range[0]}-${range[0] + mappedData.length - 1}/${total}`);
    res.set('Access-Control-Expose-Headers', 'Content-Range');
    res.json(mappedData);
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.getEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id).populate('userId', 'fullName email phoneNumber').lean();
    if (!employee) return res.status(404).json({ success: false, error: 'Not found' });
    res.status(200).json({ ...employee, id: employee._id.toString() });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('userId', 'email fullName');
    if (!employee) return res.status(404).json({ success: false, error: 'Not found' });
    res.status(200).json({ ...employee.toObject(), id: employee._id.toString() });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.deleteEmployee = async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Deleted' });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
