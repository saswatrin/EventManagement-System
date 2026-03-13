import express from 'express';
import Member from '../models/Member.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// GET /api/members - get all members
router.get('/', verifyToken, async (req, res) => {
  try {
    const members = await Member.find().sort({ createdAt: -1 });
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching members', error: error.message });
  }
});

// GET /api/members/search/:query - search members
router.get('/search/:query', verifyToken, async (req, res) => {
  try {
    const query = req.params.query;
    const members = await Member.find({
      $or: [
        { membershipNumber: { $regex: query, $options: 'i' } },
        { firstName: { $regex: query, $options: 'i' } },
        { lastName: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } }
      ]
    });
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: 'Error searching members', error: error.message });
  }
});

// GET /api/members/:membershipNumber - get member by membership number
router.get('/:membershipNumber', verifyToken, async (req, res) => {
  try {
    const member = await Member.findOne({ membershipNumber: req.params.membershipNumber });
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }
    res.json(member);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching member', error: error.message });
  }
});

// POST /api/members - create new member (admin only)
router.post('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const {
      firstName, lastName, dateOfBirth, gender, email, phone,
      address, membershipType, startDate
    } = req.body;

    if (!firstName || !lastName || !dateOfBirth || !gender || !email || !phone || !address || !startDate) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    const member = new Member({
      firstName,
      lastName,
      dateOfBirth,
      gender,
      email,
      phone,
      address,
      membershipType: membershipType || '6months',
      startDate
    });

    await member.save();
    res.status(201).json({
      message: 'Member created successfully',
      member,
      membershipNumber: member.membershipNumber
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating member', error: error.message });
  }
});

// PUT /api/members/:membershipNumber - update member (admin only)
router.put('/:membershipNumber', verifyToken, isAdmin, async (req, res) => {
  try {
    const member = await Member.findOne({ membershipNumber: req.params.membershipNumber });
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    const { action, extensionType, ...updateData } = req.body;

    if (action === 'cancel') {
      member.status = 'Cancelled';
    } else if (action === 'extend') {
      const currentEnd = new Date(member.endDate);
      const newEnd = new Date(currentEnd);
      const extType = extensionType || '6months';

      if (extType === '6months') {
        newEnd.setMonth(newEnd.getMonth() + 6);
      } else if (extType === '1year') {
        newEnd.setMonth(newEnd.getMonth() + 12);
      } else if (extType === '2years') {
        newEnd.setMonth(newEnd.getMonth() + 24);
      }

      member.endDate = newEnd;
      member.membershipType = extType;
      if (member.status === 'Cancelled' || member.status === 'Expired') {
        member.status = 'Active';
      }
    } else {
      // General update
      Object.keys(updateData).forEach(key => {
        if (updateData[key] !== undefined) {
          member[key] = updateData[key];
        }
      });
    }

    await member.save();
    res.json({ message: 'Member updated successfully', member });
  } catch (error) {
    res.status(500).json({ message: 'Error updating member', error: error.message });
  }
});

export default router;
