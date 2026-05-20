const Booking = require('../models/Booking');
const Employee = require('../models/Employee');
const User = require('../models/User');
const Notification = require('../models/Notification');

// Helper: Commission Logic
const calculateCommission = (basePrice) => {
  let percentage = 0;
  if (basePrice <= 500) percentage = 0.05;
  else if (basePrice <= 800) percentage = 0.10;
  else percentage = 0.15;

  const commission = Math.round(basePrice * percentage);
  return {
    commissionAmount: commission,
    finalPrice: basePrice + commission
  };
};

// Create a new booking
exports.createBooking = async (req, res) => {
  try {
    const { category, service, basePrice, date, time, location, additionalInstructions } = req.body;
    const userId = req.user.id || req.user._id;
    const customer = await User.findById(userId);

    // Calculate Commission and Final Price
    const { commissionAmount, finalPrice } = calculateCommission(basePrice || 0);

    const booking = new Booking({
      category,
      service,
      basePrice: basePrice || 0,
      commissionAmount,
      finalPrice,
      date,
      time,
      location,
      additionalInstructions,
      userId: userId,
      status: 'pending',
      completionOTP: Math.floor(1000 + Math.random() * 9000).toString() // Generate 4-digit OTP
    });

    const savedBooking = await booking.save();

    // Broadcast to relevant employees
    const allInCategory = await Employee.find({ service: category, isVerified: true });
    for (const emp of allInCategory) {
        const notification = new Notification({
            userId: emp.userId,
            title: 'New Job Available!',
            message: `Service: ${service}. Final Price: Rs.${finalPrice}. Location: ${location}.`
        });
        await notification.save();
    }

    res.status(201).json({ success: true, message: 'Request broadcasted.', data: savedBooking });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Employee accepts a booking (Wallet Check Added)
exports.acceptBooking = async (req, res) => {
    try {
        const userId = req.user.id || req.user._id;
        const employee = await Employee.findOne({ userId: userId });

        if (!employee || !employee.isVerified) {
            return res.status(403).json({ success: false, error: 'Only verified employees can accept bookings.' });
        }

        const booking = await Booking.findById(req.params.id);
        if (!booking || booking.status !== 'pending') {
            return res.status(400).json({ success: false, error: 'Booking no longer available.' });
        }

        // WALLET CHECK: Check if employee has enough balance for commission
        if (employee.walletBalance < booking.commissionAmount) {
            return res.status(400).json({
                success: false,
                error_code: 'INSUFFICIENT_WALLET',
                message: 'Please recharge your wallet so you can accept requests. Thank You.'
            });
        }

        booking.employeeId = employee._id;
        booking.status = 'confirmed';
        await booking.save();

        res.status(200).json({ success: true, message: 'Booking accepted', data: booking });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// Complete Booking with OTP and Wallet Deduction
exports.completeBooking = async (req, res) => {
    try {
        const { otp } = req.body;
        const booking = await Booking.findById(req.params.id).populate('employeeId');

        if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

        if (booking.completionOTP !== otp) {
            return res.status(400).json({ success: false, message: 'Invalid OTP. Please ask the customer for the correct code.' });
        }

        // Deduct Commission from Employee Wallet
        const employee = await Employee.findById(booking.employeeId);
        employee.walletBalance -= booking.commissionAmount;
        await employee.save();

        booking.status = 'completed';
        await booking.save();

        res.status(200).json({ success: true, message: 'Job completed successfully! Commission deducted.' });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// ... keep other methods (getAllBookings, getBookings, getBooking) ...
exports.getAllBookings = async (req, res) => {
  try {
    const total = await Booking.countDocuments();
    const bookings = await Booking.find()
      .populate('userId', 'fullName email phoneNumber')
      .populate({
        path: 'employeeId',
        populate: { path: 'userId', select: 'fullName phoneNumber' }
      })
      .sort({ createdAt: -1 })
      .lean();

    const mappedBookings = bookings.map(booking => ({ ...booking, id: booking._id }));
    res.set('Content-Range', `bookings 0-${bookings.length - 1}/${total}`);
    res.status(200).json(mappedBookings);
  } catch (error) { res.status(400).json({ success: false, error: error.message }); }
};

exports.getBookings = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    let query = {};
    if (req.user.role === 'user') {
      query = { userId: userId };
    } else if (req.user.role === 'employee') {
      const employee = await Employee.findOne({ userId: userId });
      if (!employee) return res.status(200).json({ success: true, data: [] });
      query = {
        $or: [
            { employeeId: employee._id },
            { status: 'pending', category: employee.service, employeeId: null }
        ]
      };
    }
    const bookings = await Booking.find(query).populate('userId', 'fullName email phoneNumber').populate({ path: 'employeeId', populate: { path: 'userId', select: 'fullName phoneNumber' } }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: bookings });
  } catch (error) { res.status(400).json({ success: false, error: error.message }); }
};

exports.getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('userId', 'fullName email phoneNumber').populate({ path: 'employeeId', populate: { path: 'userId', select: 'fullName phoneNumber' } });
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    res.status(200).json({ success: true, data: booking });
  } catch (error) { res.status(400).json({ success: false, error: error.message }); }
};
