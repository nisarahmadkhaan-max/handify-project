const mongoose = require('mongoose');
const Category = require('../models/Category');

const categories = [
    {
        name: 'Welding',
        image: 'assets/cat1.png',
        description: 'Professional welding services for all your needs'
    },
    {
        name: 'House Keeping',
        image: 'assets/cat3.png',
        description: 'Complete housekeeping and cleaning services'
    },
    {
        name: 'Painting',
        image: 'assets/cat2.png',
        description: 'Interior and exterior painting services'
    },
    {
        name: 'Plumbing',
        image: 'assets/cat1.png',
        description: 'Expert plumbing services and repairs'
    },
    {
        name: 'Electrical',
        image: 'assets/cat3.png',
        description: 'Electrical repairs and installations'
    },
    {
        name: 'Carpentry',
        image: 'assets/cat2.png',
        description: 'Custom carpentry and woodworking services'
    }
];

const seedCategories = async () => {
    try {
        // Clear existing categories
        await Category.deleteMany({});
        
        // Insert new categories
        await Category.insertMany(categories);
        
        console.log('Categories seeded successfully');
    } catch (error) {
        console.error('Error seeding categories:', error);
    }
};

module.exports = seedCategories; 