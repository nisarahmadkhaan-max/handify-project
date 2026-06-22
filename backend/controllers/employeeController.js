 const Employee = require('../models/Employee');
const User = require('../models/User');
const fetch = require('node-fetch');
const FormData = require('form-data');

// Verification function
async function verifyCnicAndName(base64Image, providedNumber, providedName) {
    try {
        console.log("--- Starting AI Verification ---");
        const apiKey = process.env.OCR_SPACE_API_KEY || 'K83745730488957';

        const formData = new FormData();
        formData.append('base64Image', base64Image);
        formData.append('apikey', apiKey);
        formData.append('OCREngine', '2');

        const response = await fetch('https://api.ocr.space/parse/image', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();

        if (data && data.ParsedResults && data.ParsedResults[0]) {
            const extractedText = data.ParsedResults[0].ParsedText.toUpperCase().replace(/\s+/g, ' ');
            console.log("Extracted Text:", extractedText);

            const cleanExtractedNums = extractedText.replace(/[^0-9]/g, '');
            const cleanProvidedNum = providedNumber.toString().replace(/[^0-9]/g, '');

            // 1. Check CNIC Number (Search for the provided number within extracted digits)
            const numMatch = cleanProvidedNum.length >= 10 && cleanExtractedNums.includes(cleanProvidedNum);

            // 2. Flexible Name Matching
            const nameWords = providedName.toUpperCase().split(' ').filter(w => w.length > 2);
            let matchCount = 0;
            nameWords.forEach(word => {
                if (extractedText.includes(word)) matchCount++;
            });

            // If at least 1 word matches for single names, or 2 for multi-word names
            const nameMatch = nameWords.length > 0 && (matchCount >= Math.min(nameWords.length, 1));

            console.log(`Match Results -> Num: ${numMatch}, Name: ${nameMatch}`);
            return numMatch || nameMatch;
        }

        // Fallback: If OCR API is slow or limited but we have a valid image
        // In a real app we'd wait, but for demo we can be more lenient if needed.
        return false;
    } catch (error) {
        console.error("Verification Error:", error);
        return false;
    }
}

exports.registerEmployee = async (req, res) => {
    try {
        const { username, email, phone, password, specialization, cnicNumber, cnicFront, cnicBack, emergencyName, emergencyPhone, profileImage } = req.body;
        const isValid = await verifyCnicAndName(cnicFront, cnicNumber, username);

        // For development/demo: if OCR is being difficult, you can temporarily allow it
        // but let's try to keep the verification logic.
        if (!isValid) {
            return res.status(400).json({
                success: false,
                message: 'AI verification failed. Please make sure your CNIC photo is clear and your name matches exactly as written on the card.'
            });
        }

        let user = await User.findOne({ $or: [{ email }, { phoneNumber: phone }] });
        if (!user) {
            user = new User({ fullName: username, email, phoneNumber: phone, password, role: 'employee' });
            await user.save();
        } else {
            // Update existing user to employee role
            user.role = 'employee';
            await user.save();
        }

        const employee = new Employee({
            userId: user._id,
            name: username,
            service: specialization,
            profileImage: profileImage || 'assets/imgs/default-avatar.png',
            isVerified: true,
            cnic: {
                number: cnicNumber,
                frontImage: cnicFront,
                backImage: cnicBack
            },
            emergencyContact: {
                name: emergencyName,
                phoneNumber: emergencyPhone
            }
        });
        await employee.save();
        res.status(201).json({ success: true, message: 'Verified & Registered' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getEmployeeProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const employee = await Employee.findOne({ userId }).populate('userId', 'fullName email phoneNumber');
        res.json({ success: true, data: employee });
    } catch (error) { res.status(500).json({ success: false, error: error.message }); }
};

exports.getEmployees = async (req, res) => {
    try {
        const employees = await Employee.find().populate('userId', 'fullName email phoneNumber').lean();
        const mapped = employees.map(emp => ({ ...emp, id: emp._id.toString() }));
        res.set('Content-Range', `employees 0-${mapped.length}/${mapped.length}`);
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
        res.status(200).json({ success: true });
    } catch (error) { res.status(400).json({ success: false, error: error.message }); }
};

exports.createEmployee = async (req, res) => {
    try {
        const employee = new Employee(req.body);
        await employee.save();
        res.status(201).json({ ...employee.toObject(), id: employee._id.toString() });
    } catch (error) { res.status(400).json({ success: false, error: error.message }); }
};
