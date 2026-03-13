const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    reportType: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    data: { type: mongoose.Schema.Types.Mixed },
    generatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    generatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);
