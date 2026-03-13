const express = require('express');
const router = express.Router();
const Membership = require('../models/Membership');
const { auth, adminAuth } = require('../middleware/auth');

// Generate membership number
const generateMembershipNumber = async () => {
    const count = await Membership.countDocuments();
    return `MEM${String(count + 1).padStart(6, '0')}`;
};

// Calculate end date based on membership type
const calculateEndDate = (startDate, type) => {
    const date = new Date(startDate);
    switch (type) {
        case '6months':
            date.setMonth(date.getMonth() + 6);
            break;
        case '1year':
            date.setFullYear(date.getFullYear() + 1);
            break;
        case '2years':
            date.setFullYear(date.getFullYear() + 2);
            break;
    }
    return date;
};

// Add membership (Admin only)
router.post('/', auth, adminAuth, async (req, res) => {
    try {
        const { name, email, phone, address, membershipType } = req.body;

        if (!name || !email || !phone || !address || !membershipType) {
            return res.status(400).json({ message: 'All fields are mandatory' });
        }

        const membershipNumber = await generateMembershipNumber();
        const startDate = new Date();
        const endDate = calculateEndDate(startDate, membershipType);

        const membership = new Membership({
            membershipNumber,
            name,
            email,
            phone,
            address,
            membershipType,
            startDate,
            endDate,
            createdBy: req.user.id
        });

        await membership.save();
        res.status(201).json({ message: 'Membership created successfully', membership });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get membership by number
router.get('/:membershipNumber', auth, async (req, res) => {
    try {
        const membership = await Membership.findOne({
            membershipNumber: req.params.membershipNumber
        });

        if (!membership) {
            return res.status(404).json({ message: 'Membership not found' });
        }

        res.json(membership);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update membership (Admin only)
router.put('/:membershipNumber', auth, adminAuth, async (req, res) => {
    try {
        const { action, extensionType } = req.body;
        const membership = await Membership.findOne({
            membershipNumber: req.params.membershipNumber
        });

        if (!membership) {
            return res.status(404).json({ message: 'Membership not found' });
        }

        if (action === 'extend') {
            const extension = extensionType || '6months';
            membership.endDate = calculateEndDate(membership.endDate, extension);
            membership.status = 'active';
        } else if (action === 'cancel') {
            membership.status = 'cancelled';
        }

        await membership.save();
        res.json({ message: 'Membership updated successfully', membership });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all memberships
router.get('/', auth, async (req, res) => {
    try {
        const memberships = await Membership.find().sort({ createdAt: -1 });
        res.json(memberships);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
