import mongoose from 'mongoose';

const venueSchema = new mongoose.Schema({
  venueId: {
    type: String,
    unique: true
  },
  venueName: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true
  },
  capacity: {
    type: Number,
    required: true
  },
  contactPerson: {
    type: String
  },
  contactPhone: {
    type: String
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

venueSchema.pre('save', function (next) {
  if (!this.venueId) {
    this.venueId = 'VEN' + Date.now();
  }
  next();
});

const Venue = mongoose.model('Venue', venueSchema);

export default Venue;
