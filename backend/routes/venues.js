import express from 'express';
import Venue from '../models/Venue.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// GET /api/venues - get all venues
router.get('/', verifyToken, async (req, res) => {
  try {
    const venues = await Venue.find().sort({ createdAt: -1 });
    res.json(venues);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching venues', error: error.message });
  }
});

// GET /api/venues/:venueId - get venue by venueId
router.get('/:venueId', verifyToken, async (req, res) => {
  try {
    const venue = await Venue.findOne({ venueId: req.params.venueId });
    if (!venue) {
      return res.status(404).json({ message: 'Venue not found' });
    }
    res.json(venue);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching venue', error: error.message });
  }
});

// POST /api/venues - create venue (admin only)
router.post('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const { venueName, address, capacity, contactPerson, contactPhone } = req.body;

    if (!venueName || !address || !capacity) {
      return res.status(400).json({ message: 'Venue name, address, and capacity are required' });
    }

    const venue = new Venue({
      venueName,
      address,
      capacity: Number(capacity),
      contactPerson,
      contactPhone
    });

    await venue.save();
    res.status(201).json({
      message: 'Venue created successfully',
      venue,
      venueId: venue.venueId
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating venue', error: error.message });
  }
});

// PUT /api/venues/:venueId - update venue (admin only)
router.put('/:venueId', verifyToken, isAdmin, async (req, res) => {
  try {
    const venue = await Venue.findOne({ venueId: req.params.venueId });
    if (!venue) {
      return res.status(404).json({ message: 'Venue not found' });
    }

    const { venueName, address, capacity, contactPerson, contactPhone, status } = req.body;

    if (venueName) venue.venueName = venueName;
    if (address) venue.address = address;
    if (capacity) venue.capacity = Number(capacity);
    if (contactPerson !== undefined) venue.contactPerson = contactPerson;
    if (contactPhone !== undefined) venue.contactPhone = contactPhone;
    if (status) venue.status = status;

    await venue.save();
    res.json({ message: 'Venue updated successfully', venue });
  } catch (error) {
    res.status(500).json({ message: 'Error updating venue', error: error.message });
  }
});

export default router;
