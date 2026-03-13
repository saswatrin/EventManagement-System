const mongoose = require('mongoose');

const membershipSchema = new mongoose.Schema({
    membershipNumber: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    membershipType: {
        type: String,
        enum: ['6months', '1year', '2years'],
        default: '6months',
        required: true
    },
    startDate: { type: Date, required: true, default: Date.now },
    endDate: { type: Date, required: true },
    status: {
        type: String,
        enum: ['active', 'cancelled', 'expired'],
        default: 'active'
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Membership', membershipSchema);
