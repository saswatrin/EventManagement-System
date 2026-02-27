const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
    items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }],
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'completed', 'cancelled'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
