const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');

async function seedAdmin() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Clear existing users
        await User.deleteMany({});

        const hashedPassword = await bcrypt.hash('admin123', 10);

        // Create admin user
        const admin = await User.create({
            userId: 'admin',
            name: 'Admin User',
            email: 'admin@eventmanagement.com',
            password: hashedPassword,
            role: 'admin'
        });

        // Create regular user
        const user = await User.create({
            userId: 'user1',
            name: 'Regular User',
            email: 'user@eventmanagement.com',
            password: hashedPassword,
            role: 'user'
        });

        console.log('\n✅ Users created successfully!');
        console.log('\nAdmin Login:');
        console.log('User ID: admin');
        console.log('Password: admin123');
        console.log('\nUser Login:');
        console.log('User ID: user1');
        console.log('Password: admin123');

        mongoose.connection.close();
    } catch (error) {
        console.error('Seeding error:', error);
        process.exit(1);
    }
}

seedAdmin();
