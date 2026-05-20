const Settings = require('../models/Settings');
const mongoose = require('mongoose');

// Get all settings (for Admin Panel List)
exports.getAllSettings = async (req, res) => {
  try {
    const settings = await Settings.find().sort({ key: 1 }).lean();
    // React Admin ke liye hum hamesha _id ko hi id banayenge
    const mapped = settings.map(s => ({
      ...s,
      id: s._id.toString()
    }));

    res.set('Content-Range', `settings 0-${mapped.length - 1}/${mapped.length}`);
    res.set('Access-Control-Expose-Headers', 'Content-Range');
    res.status(200).json(mapped);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get single setting by ID (For Admin Edit)
exports.getSettingById = async (req, res) => {
  try {
    const setting = await Settings.findById(req.params.id).lean();
    if (!setting) return res.status(404).json({ success: false, message: 'Setting not found' });

    res.status(200).json({ ...setting, id: setting._id.toString() });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Get setting by KEY (For Mobile App)
exports.getSettingByKey = async (req, res) => {
  try {
    const setting = await Settings.findOne({ key: req.params.key }).lean();
    if (!setting) return res.status(404).json({ success: false, message: 'Setting not found' });

    res.status(200).json({ success: true, data: setting.value });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Update setting
exports.updateSetting = async (req, res) => {
  try {
    const { value, description } = req.body;
    const setting = await Settings.findByIdAndUpdate(
      req.params.id,
      { value, description },
      { new: true }
    ).lean();

    if (!setting) return res.status(404).json({ success: false, message: 'Setting not found' });

    res.status(200).json({ ...setting, id: setting._id.toString() });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
