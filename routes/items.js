const express = require('express');
const router = express.Router();
const Item = require('../models/Item');

router.post('/', async (req, res) => {
    try {
        const item = new Item(req.body);
        await item.save();
        res.status(201).json(item);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const items = await Item.find().populate('vendorId', 'name category');
        res.json(items);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
