const Service = require('../models/Service');

// Helper to format response for React Admin
const formatRecord = (doc) => {
    if (!doc) return null;
    const obj = doc.toObject ? doc.toObject() : doc;
    obj.id = obj._id.toString();
    // Keep _id for backend compatibility but ensure id exists for frontend
    return obj;
};

exports.getAllServices = async (req, res) => {
  try {
    let query = {};
    if (req.query.filter) {
      const filter = JSON.parse(req.query.filter);
      if (filter.q) query.name = { $regex: filter.q, $options: 'i' };
      if (filter.category) query.category = filter.category;
      Object.keys(filter).forEach(key => {
        if (key !== 'q' && key !== 'category' && filter[key]) {
          query[key] = filter[key];
        }
      });
    }

    const range = req.query.range ? JSON.parse(req.query.range) : [0, 9];
    const sort = req.query.sort ? JSON.parse(req.query.sort) : ['_id', 'ASC'];
    const skip = range[0];
    const limit = range[1] - range[0] + 1;

    const total = await Service.countDocuments(query);
    const services = await Service.find(query)
      .sort({ [sort[0] === 'id' ? '_id' : sort[0]]: sort[1] === 'ASC' ? 1 : -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const mappedData = services.map(s => ({ ...s, id: s._id.toString() }));

    res.set('Content-Range', `services ${skip}-${skip + services.length - 1}/${total}`);
    res.set('Access-Control-Expose-Headers', 'Content-Range');
    res.json(mappedData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).lean();
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.json({ ...service, id: service._id.toString() });
  } catch (error) {
    res.status(500).json({ message: 'Invalid ID format' });
  }
};

exports.getServicesByCategory = async (req, res) => {
  try {
    const services = await Service.find({ category: req.params.category }).lean();
    res.json(services.map(s => ({ ...s, id: s._id.toString() })));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createService = async (req, res) => {
  try {
    const service = new Service(req.body);
    await service.save();
    res.status(201).json({ ...service.toObject(), id: service._id.toString() });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateService = async (req, res) => {
  try {
    const updated = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true }).lean();
    if (!updated) return res.status(404).json({ message: 'Not found' });
    res.json({ ...updated, id: updated._id.toString() });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteService = async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.json({ id: req.params.id });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
