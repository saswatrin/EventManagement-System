import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    unique: true
  },
  membershipNumber: {
    type: String,
    required: true
  },
  memberName: {
    type: String
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  },
  eventName: {
    type: String
  },
  bookingDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['Confirmed', 'Cancelled'],
    default: 'Confirmed'
  },
  paymentStatus: {
    type: String,
    enum: ['Paid', 'Pending', 'Refunded'],
    default: 'Pending'
  },
  amount: {
    type: Number,
    default: 0
  }
});

bookingSchema.pre('save', function (next) {
  if (!this.bookingId) {
    this.bookingId = 'BKG' + Date.now();
  }
  next();
});

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
