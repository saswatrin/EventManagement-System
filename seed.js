const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Vendor = require('./models/Vendor');

async function seed() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Clear existing data
        await User.deleteMany({});
        await Vendor.deleteMany({});

        // Create test user
        const hashedPassword = await bcrypt.hash('admin123', 10);
        const user = await User.create({
            userId: 'vendor1',
            password: hashedPassword,
            role: 'vendor'
        });

        console.log('Test user created:');
        console.log('User ID: vendor1');
        console.log('Password: admin123');

        // Create test vendor
        const vendor = await Vendor.create({
            name: 'Test Vendor',
            email: 'vendor@test.com',
            password: hashedPassword,
            category: 'Catering',
            userId: user._id
        });

        console.log('\nTest vendor created:', vendor.name);

        mongoose.connection.close();
        console.log('\nSeeding completed!');
    } catch (error) {
        console.error('Seeding error:', error);
        process.exit(1);
    }
}

seed();
