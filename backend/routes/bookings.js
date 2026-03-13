import express from 'express';
import Booking from '../models/Booking.js';
import Member from '../models/Member.js';
import Event from '../models/Event.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/bookings - get all bookings
router.get('/', verifyToken, async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ bookingDate: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings', error: error.message });
  }
});

// GET /api/bookings/member/:membershipNumber - get bookings for a member
router.get('/member/:membershipNumber', verifyToken, async (req, res) => {
  try {
    const bookings = await Booking.find({ membershipNumber: req.params.membershipNumber }).sort({ bookingDate: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching member bookings', error: error.message });
  }
});

// POST /api/bookings - create booking
router.post('/', verifyToken, async (req, res) => {
  try {
    const { membershipNumber, eventId, paymentStatus } = req.body;

    if (!membershipNumber || !eventId) {
      return res.status(400).json({ message: 'Membership number and event ID are required' });
    }

    // Find member
    const member = await Member.findOne({ membershipNumber });
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    if (member.status !== 'Active') {
      return res.status(400).json({ message: 'Member membership is not active' });
    }

    // Find event
    const event = await Event.findOne({ eventId });
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.status === 'Cancelled' || event.status === 'Completed') {
      return res.status(400).json({ message: 'Event is not available for registration' });
    }

    // Check if already registered
    const existingBooking = await Booking.findOne({
      membershipNumber,
      eventId: event._id,
      status: 'Confirmed'
    });
    if (existingBooking) {
      return res.status(400).json({ message: 'Member is already registered for this event' });
    }

    // Check participant count
    const confirmedBookings = await Booking.countDocuments({
      eventId: event._id,
      status: 'Confirmed'
    });
    if (confirmedBookings >= event.maxParticipants) {
      return res.status(400).json({ message: 'Event is fully booked' });
    }

    const booking = new Booking({
      membershipNumber,
      memberName: `${member.firstName} ${member.lastName}`,
      eventId: event._id,
      eventName: event.eventName,
      paymentStatus: paymentStatus || 'Pending',
      amount: event.fee
    });

    await booking.save();
    res.status(201).json({
      message: 'Booking created successfully',
      booking,
      bookingId: booking.bookingId
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating booking', error: error.message });
  }
});

// PUT /api/bookings/:bookingId - update booking status
router.put('/:bookingId', verifyToken, async (req, res) => {
  try {
    const booking = await Booking.findOne({ bookingId: req.params.bookingId });
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const { status, paymentStatus } = req.body;

    if (status) booking.status = status;
    if (paymentStatus) booking.paymentStatus = paymentStatus;

    await booking.save();
    res.json({ message: 'Booking updated successfully', booking });
  } catch (error) {
    res.status(500).json({ message: 'Error updating booking', error: error.message });
  }
});

export default router;
