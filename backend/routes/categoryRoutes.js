const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const Category = require('../models/Category');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// 1. Get all categories for mobile app
router.get('/', categoryController.getAllCategories);

// 2. Get featured categories
router.get('/featured', categoryController.getFeaturedCategories);

// 3. Get all categories for React Admin (with proper ID mapping)
router.get('/admin', async (req, res) => {
  try {
    let query = {};
    if (req.query.filter) {
      const filter = JSON.parse(req.query.filter);
      if (filter.q) query.name = { $regex: filter.q, $options: 'i' };
      Object.keys(filter).forEach(key => {
        if (key !== 'q' && filter[key]) query[key] = filter[key];
      });
    }

    const range = req.query.range ? JSON.parse(req.query.range) : [0, 99];
    const sort = req.query.sort ? JSON.parse(req.query.sort) : ['_id', 'ASC'];
    const skip = range[0];
    const limit = range[1] - range[0] + 1;

    const total = await Category.countDocuments(query);
    const categories = await Category.find(query)
      .sort({ [sort[0] === 'id' ? '_id' : sort[0]]: sort[1] === 'ASC' ? 1 : -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const mappedData = categories.map(c => ({ ...c, id: c._id.toString() }));

    res.set('Content-Range', `categories ${skip}-${skip + categories.length - 1}/${total}`);
    res.set('Access-Control-Expose-Headers', 'Content-Range');
    res.json(mappedData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 4. Admin specific routes
router.post('/', auth, admin, categoryController.createCategory);
router.get('/:id', categoryController.getCategoryById);
router.put('/:id', auth, admin, categoryController.updateCategory);
router.delete('/:id', auth, admin, categoryController.deleteCategory);

module.exports = router;
