const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Vendor = require('../models/Vendor');

router.post('/signup', async (req, res) => {
    try {
        const { name, email, password, category } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const vendor = new Vendor({ name, email, password: hashedPassword, category });
        await vendor.save();

        res.status(201).json({ message: 'Vendor registered successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const vendors = await Vendor.find().select('-password');
        res.json(vendors);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
