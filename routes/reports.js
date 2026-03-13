const express = require('express');
const router = express.Router();
const Report = require('../models/Report');
const Membership = require('../models/Membership');
const Transaction = require('../models/Transaction');
const { auth } = require('../middleware/auth');

// Generate membership report
router.post('/membership', auth, async (req, res) => {
    try {
        const memberships = await Membership.find();
        const active = memberships.filter(m => m.status === 'active').length;
        const cancelled = memberships.filter(m => m.status === 'cancelled').length;
        const expired = memberships.filter(m => m.status === 'expired').length;

        const report = new Report({
            reportType: 'membership',
            title: 'Membership Report',
            description: 'Overview of all memberships',
            data: {
                total: memberships.length,
                active,
                cancelled,
                expired,
                memberships
            },
            generatedBy: req.user.id
        });

        await report.save();
        res.json(report);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Generate transaction report
router.post('/transaction', auth, async (req, res) => {
    try {
        const transactions = await Transaction.find().populate('vendorId', 'name');
        const totalAmount = transactions.reduce((sum, t) => sum + t.totalAmount, 0);
        const completed = transactions.filter(t => t.status === 'completed').length;
        const pending = transactions.filter(t => t.status === 'pending').length;

        const report = new Report({
            reportType: 'transaction',
            title: 'Transaction Report',
            description: 'Overview of all transactions',
            data: {
                total: transactions.length,
                totalAmount,
                completed,
                pending,
                transactions
            },
            generatedBy: req.user.id
        });

        await report.save();
        res.json(report);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all reports
router.get('/', auth, async (req, res) => {
    try {
        const reports = await Report.find()
            .populate('generatedBy', 'name email')
            .sort({ createdAt: -1 });
        res.json(reports);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
