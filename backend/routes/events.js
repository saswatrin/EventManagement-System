import express from 'express';
import Event from '../models/Event.js';
import Venue from '../models/Venue.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// GET /api/events - get all events
router.get('/', verifyToken, async (req, res) => {
  try {
    const events = await Event.find().sort({ eventDate: -1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching events', error: error.message });
  }
});

// GET /api/events/:eventId - get event by eventId
router.get('/:eventId', verifyToken, async (req, res) => {
  try {
    const event = await Event.findOne({ eventId: req.params.eventId });
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching event', error: error.message });
  }
});

// POST /api/events - create event (admin only)
router.post('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const {
      eventName, description, category, venueId, eventDate,
      startTime, endTime, maxParticipants, fee, status
    } = req.body;

    if (!eventName || !description || !category || !eventDate || !startTime || !endTime || !maxParticipants) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    let venueName = '';
    if (venueId) {
      const venue = await Venue.findOne({ venueId: venueId });
      if (venue) {
        venueName = venue.venueName;
      }
    }

    const event = new Event({
      eventName,
      description,
      category,
      venueId: venueId ? (await Venue.findOne({ venueId }))?.['_id'] : null,
      venueName,
      eventDate,
      startTime,
      endTime,
      maxParticipants: Number(maxParticipants),
      fee: fee ? Number(fee) : 0,
      status: status || 'Upcoming'
    });

    await event.save();
    res.status(201).json({
      message: 'Event created successfully',
      event,
      eventId: event.eventId
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating event', error: error.message });
  }
});

// PUT /api/events/:eventId - update event (admin only)
router.put('/:eventId', verifyToken, isAdmin, async (req, res) => {
  try {
    const event = await Event.findOne({ eventId: req.params.eventId });
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const {
      eventName, description, category, venueId, eventDate,
      startTime, endTime, maxParticipants, fee, status
    } = req.body;

    if (eventName) event.eventName = eventName;
    if (description) event.description = description;
    if (category) event.category = category;
    if (eventDate) event.eventDate = eventDate;
    if (startTime) event.startTime = startTime;
    if (endTime) event.endTime = endTime;
    if (maxParticipants) event.maxParticipants = Number(maxParticipants);
    if (fee !== undefined) event.fee = Number(fee);
    if (status) event.status = status;

    if (venueId) {
      const venue = await Venue.findOne({ venueId });
      if (venue) {
        event.venueId = venue._id;
        event.venueName = venue.venueName;
      }
    }

    await event.save();
    res.json({ message: 'Event updated successfully', event });
  } catch (error) {
    res.status(500).json({ message: 'Error updating event', error: error.message });
  }
});

// DELETE /api/events/:eventId - delete event (admin only)
router.delete('/:eventId', verifyToken, isAdmin, async (req, res) => {
  try {
    const event = await Event.findOneAndDelete({ eventId: req.params.eventId });
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting event', error: error.message });
  }
});

export default router;
