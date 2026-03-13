import express from 'express';
import Member from '../models/Member.js';
import Event from '../models/Event.js';
import Booking from '../models/Booking.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/reports/members - member report with filters
router.get('/members', verifyToken, async (req, res) => {
  try {
    const { status, startDate, endDate } = req.query;
    const filter = {};

    if (status && status !== 'All') {
      filter.status = status;
    }
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate + 'T23:59:59');
    }

    const members = await Member.find(filter).sort({ createdAt: -1 });
    res.json({ members, total: members.length });
  } catch (error) {
    res.status(500).json({ message: 'Error generating member report', error: error.message });
  }
});

// GET /api/reports/events - event report with filters
router.get('/events', verifyToken, async (req, res) => {
  try {
    const { category, status, startDate, endDate } = req.query;
    const filter = {};

    if (category && category !== 'All') {
      filter.category = category;
    }
    if (status && status !== 'All') {
      filter.status = status;
    }
    if (startDate || endDate) {
      filter.eventDate = {};
      if (startDate) filter.eventDate.$gte = new Date(startDate);
      if (endDate) filter.eventDate.$lte = new Date(endDate + 'T23:59:59');
    }

    const events = await Event.find(filter).sort({ eventDate: -1 });
    res.json({ events, total: events.length });
  } catch (error) {
    res.status(500).json({ message: 'Error generating event report', error: error.message });
  }
});

// GET /api/reports/bookings - booking report with filters
router.get('/bookings', verifyToken, async (req, res) => {
  try {
    const { status, paymentStatus, startDate, endDate } = req.query;
    const filter = {};

    if (status && status !== 'All') {
      filter.status = status;
    }
    if (paymentStatus && paymentStatus !== 'All') {
      filter.paymentStatus = paymentStatus;
    }
    if (startDate || endDate) {
      filter.bookingDate = {};
      if (startDate) filter.bookingDate.$gte = new Date(startDate);
      if (endDate) filter.bookingDate.$lte = new Date(endDate + 'T23:59:59');
    }

    const bookings = await Booking.find(filter).sort({ bookingDate: -1 });
    const totalAmount = bookings.reduce((sum, b) => sum + (b.amount || 0), 0);
    res.json({ bookings, total: bookings.length, totalAmount });
  } catch (error) {
    res.status(500).json({ message: 'Error generating booking report', error: error.message });
  }
});

export default router;
