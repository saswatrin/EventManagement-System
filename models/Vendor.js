const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    category: {
        type: String,
        enum: ['Catering', 'Florist', 'Decoration', 'Lighting'],
        required: true
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Vendor', vendorSchema);
