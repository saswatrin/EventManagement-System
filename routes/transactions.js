const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');

router.post('/', async (req, res) => {
    try {
        const transaction = new Transaction(req.body);
        await transaction.save();
        res.status(201).json(transaction);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const transactions = await Transaction.find()
            .populate('vendorId', 'name')
            .populate('items');
        res.json(transactions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
