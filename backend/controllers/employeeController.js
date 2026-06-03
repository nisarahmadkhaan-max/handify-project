const Employee = require('../models/Employee');
const User = require('../models/User');
const Tesseract = require('tesseract.js');

// Pre-initialize Tesseract Worker for speed
let worker = null;
const initTesseract = async () => {
    try {
        worker = await Tesseract.createWorker('eng');
        console.log("🚀 Tesseract Worker Initialized & Ready");
    } catch (err) {
        console.error("❌ Tesseract Init Error:", err);
    }
};
initTesseract();

async function verifyCnicAndName(base64Image, providedNumber, providedName) {
    try {
        if (!worker) await initTesseract();

        console.log("--- Starting Dual Verification (Name + Number) ---");
        const { data: { text } } = await worker.recognize(base64Image);

        // 1. Check CNIC Number
        const cleanExtractedNums = text.replace(/[^0-9]/g, '');
        const cleanProvidedNum = providedNumber.replace(/[^0-9]/g, '');
        const isNumberMatch = cleanExtractedNums.includes(cleanProvidedNum);

        // 2. Check Name (Fuzzy match - check if major parts of name exist in text)
        const extractedTextUpper = text.toUpperCase();
        const providedNameParts = providedName.toUpperCase().split(' ').filter(part => part.length > 2);

        let matchCount = 0;
        providedNameParts.forEach(part => {
            if (extractedTextUpper.includes(part)) {
                matchCount++;
            }
        });

        // If number matches and at least one part of the name matches (or majority of parts)
        const isNameMatch = matchCount > 0;

        console.log("Number Match:", isNumberMatch, "| Name Match Count:", matchCount);

        return isNumberMatch && isNameMatch;
    } catch (error) {
        console.error("OCR Error:", error);
        return false;
    }
}

exports.registerEmployee = async (req, res) => {
  try {
    const {
      username, email, phone, password, specialization,
      availableFrom, availableTo, cnicNumber, cnicFront, cnicBack, selfie,
      emergencyName, emergencyPhone
    } = req.body;

    // Use Dual Verification Logic
    const isValid = await verifyCnicAndName(cnicFront, cnicNumber, username);

    if (!isValid) {
        return res.status(400).json({
            success: false,
            message: 'Verification Failed: We could not match your Name or CNIC Number from the uploaded photo. Please ensure the photo is clear and the details match exactly.'
        });
    }

    let user = await User.findOne({ $or: [{ email }, { phoneNumber: phone }] });

    if (user) {
      const existingEmployee = await Employee.findOne({ userId: user._id });
      if (existingEmployee) return res.status(400).json({ success: false, message: 'Already registered as employee' });
      if (user.role === 'user') {
        user.role = 'employee';
        user.fullName = username; // Sync name with CNIC name
        await user.save();
      }
    } else {
      user = new User({ fullName: username, email, phoneNumber: phone, password, role: 'employee' });
      await user.save();
    }

    const employee = new Employee({
      userId: user._id,
      name: username,
      service: specialization,
      availability: [{ day: 'monday', startTime: availableFrom || '09:00 AM', endTime: availableTo || '06:00 PM' }],
      cnic: {
          number: cnicNumber,
          frontImage: cnicFront,
          backImage: cnicBack,
          selfieWithCnic: selfie || cnicFront // Fallback if selfie is removed from UI
      },
      emergencyContact: { name: emergencyName, phoneNumber: emergencyPhone },
      isVerified: true
    });
    await employee.save();

    res.status(201).json({ success: true, message: 'Identity Verified! Professional account created successfully.', isVerified: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ... existing controller functions ...
exports.getEmployeeProfile = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const employee = await Employee.findOne({ userId }).populate('userId', 'fullName email phoneNumber');
    res.json({ success: true, data: employee });
  } catch (error) { res.status(500).json({ success: false, error: error.message }); }
};

exports.getEmployees = async (req, res) => {
  try {
    const total = await Employee.countDocuments();
    const employees = await Employee.find().populate('userId', 'fullName email phoneNumber').sort({ createdAt: -1 }).lean();
    const mapped = employees.map(emp => ({ ...emp, id: emp._id.toString() }));
    res.set('Content-Range', `employees 0-${mapped.length-1}/${total}`);
    res.set('Access-Control-Expose-Headers', 'Content-Range');
    res.json(mapped);
  } catch (error) { res.status(400).json({ success: false, error: error.message }); }
};

exports.getEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id).populate('userId', 'fullName email phoneNumber').lean();
    res.status(200).json({ ...employee, id: employee._id.toString() });
  } catch (error) { res.status(400).json({ success: false, error: error.message }); }
};

exports.updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ ...employee.toObject(), id: employee._id.toString() });
  } catch (error) { res.status(400).json({ success: false, error: error.message }); }
};

exports.deleteEmployee = async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Deleted' });
  } catch (error) { res.status(400).json({ success: false, error: error.message }); }
};
