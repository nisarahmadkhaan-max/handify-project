const Employee = require('../models/Employee');
const User = require('../models/User');
const fetch = require('node-fetch');
const FormData = require('form-data');

// Professional Verification using OCR.space (Free & Vercel Compatible)
async function verifyCnicAndName(base64Image, providedNumber, providedName) {
    try {
        console.log("--- Starting Real-time AI Verification (OCR.space) ---");

        // Use 'helloworld' as default free key or get a free one from ocr.space
        const apiKey = process.env.OCR_SPACE_API_KEY || 'helloworld';

        const formData = new FormData();
        formData.append('base64Image', base64Image);
        formData.append('apikey', apiKey);
        formData.append('language', 'eng');
        formData.append('isOverlayRequired', 'false');

        const response = await fetch('https://api.ocr.space/parse/image', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (data && data.ParsedResults && data.ParsedResults[0]) {
            const extractedText = data.ParsedResults[0].ParsedText.toUpperCase();
            console.log("Extracted Text:", extractedText);

            // 1. Check CNIC Number Match
            const cleanExtractedNums = extractedText.replace(/[^0-9]/g, '');
            const cleanProvidedNum = providedNumber.replace(/[^0-9]/g, '');
            const isNumberMatch = cleanExtractedNums.includes(cleanProvidedNum);

            // 2. Check Name Match (Fuzzy)
            const providedNameParts = providedName.toUpperCase().split(' ').filter(part => part.length > 2);
            let matchCount = 0;
            providedNameParts.forEach(part => {
                if (extractedText.includes(part)) matchCount++;
            });

            console.log("Number Match:", isNumberMatch, "| Name Match Count:", matchCount);

            // Return true if both match
            return isNumberMatch && matchCount > 0;
        }

        console.error("OCR.space Error:", data.ErrorMessage);
        return false;
    } catch (error) {
        console.error("Verification Error:", error);
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

    // Real-time AI Check
    const isValid = await verifyCnicAndName(cnicFront, cnicNumber, username);

    if (!isValid) {
        return res.status(400).json({
            success: false,
            message: 'Verification Failed: Details on CNIC do not match your profile. Please ensure the photo is clear and matches your name/number.'
        });
    }

    let user = await User.findOne({ $or: [{ email }, { phoneNumber: phone }] });

    if (user) {
      const existingEmployee = await Employee.findOne({ userId: user._id });
      if (existingEmployee) return res.status(400).json({ success: false, message: 'Already registered as employee' });
      if (user.role === 'user') {
        user.role = 'employee';
        user.fullName = username;
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
          selfieWithCnic: selfie || cnicFront
      },
      emergencyContact: { name: emergencyName, phoneNumber: emergencyPhone },
      isVerified: true // Set to true automatically since AI verified it
    });
    await employee.save();

    res.status(201).json({
        success: true,
        message: 'Identity Verified by AI! Your professional account is now active.',
        isVerified: true
    });
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
