const TopupRequest = require('../models/TopupRequest');
const Employee = require('../models/Employee');

// Admin: Get all top-up requests
exports.getAllTopupRequests = async (req, res) => {
  try {
    const requests = await TopupRequest.find()
      .populate('employeeId', 'name')
      .sort({ createdAt: -1 })
      .lean();

    const mapped = requests.map(r => ({ ...r, id: r._id.toString() }));

    res.set('Content-Range', `topups 0-${mapped.length - 1}/${mapped.length}`);
    res.set('Access-Control-Expose-Headers', 'Content-Range');
    res.status(200).json(mapped);
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Admin: Get single request
exports.getTopupRequestById = async (req, res) => {
  try {
    const request = await TopupRequest.findById(req.params.id).populate('employeeId', 'name').lean();
    if (!request) return res.status(404).json({ success: false, message: 'Request not found' });

    res.status(200).json({ ...request, id: request._id.toString() });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Admin: Approve or Reject
exports.updateTopupStatus = async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    const request = await TopupRequest.findById(req.params.id);

    if (!request) return res.status(404).json({ success: false, message: 'Request not found' });
    if (request.status !== 'pending') return res.status(400).json({ success: false, message: 'Request already processed' });

    request.status = status;
    request.adminNotes = adminNotes;
    await request.save();

    if (status === 'approved') {
      const employee = await Employee.findById(request.employeeId);
      if (employee) {
        employee.walletBalance = (employee.walletBalance || 0) + request.amount;
        await employee.save();
      }
    }

    res.status(200).json({ ...request.toObject(), id: request._id.toString() });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Employee: Submit Topup Request (FIXED)
exports.submitTopupRequest = async (req, res) => {
  try {
    const { amount, transactionId, screenshot } = req.body;

    // req.user._id use karein (auth middleware se aata hai)
    const userId = req.user._id;

    const employee = await Employee.findOne({ userId });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee profile not found. Please register as an employee first.'
      });
    }

    const topup = new TopupRequest({
      employeeId: employee._id,
      amount: Number(amount), // Ensure number
      transactionId,
      screenshot,
      status: 'pending'
    });

    await topup.save();
    res.status(201).json({ success: true, message: 'Request submitted successfully!' });
  } catch (error) {
    console.error('Topup Submission Error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};
