import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema({
  membershipNumber: {
    type: String,
    unique: true
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  membershipType: {
    type: String,
    enum: ['6months', '1year', '2years'],
    default: '6months'
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['Active', 'Cancelled', 'Expired'],
    default: 'Active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save hook to auto-generate membership number and calculate end date
memberSchema.pre('save', function (next) {
  if (!this.membershipNumber) {
    this.membershipNumber = 'MEM' + Date.now();
  }
  if (this.startDate && this.membershipType) {
    const start = new Date(this.startDate);
    let end = new Date(start);
    if (this.membershipType === '6months') {
      end.setMonth(end.getMonth() + 6);
    } else if (this.membershipType === '1year') {
      end.setMonth(end.getMonth() + 12);
    } else if (this.membershipType === '2years') {
      end.setMonth(end.getMonth() + 24);
    }
    this.endDate = end;
  }
  next();
});

const Member = mongoose.model('Member', memberSchema);

export default Member;
