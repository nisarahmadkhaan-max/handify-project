const Category = require('../models/Category');

// Get all categories for mobile app
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find({ isActive: true }).lean();
        res.json(categories.map(c => ({ ...c, id: c._id.toString() })));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get featured categories
exports.getFeaturedCategories = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 3;
        const categories = await Category.find({ isActive: true })
            .sort({ createdAt: -1 })
            .limit(limit)
            .lean();
        res.json(categories.map(c => ({ ...c, id: c._id.toString() })));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get category by ID - ID mapping added
exports.getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id).lean();
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.json({ ...category, id: category._id.toString() });
    } catch (error) {
        res.status(500).json({ message: 'Invalid Category ID' });
    }
};

// Create a new category
exports.createCategory = async (req, res) => {
    try {
        const category = new Category(req.body);
        await category.save();
        res.status(201).json({ ...category.toObject(), id: category._id.toString() });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update a category
exports.updateCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        ).lean();
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.json({ ...category, id: category._id.toString() });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a category
exports.deleteCategory = async (req, res) => {
    try {
        await Category.findByIdAndDelete(req.params.id);
        res.json({ id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
