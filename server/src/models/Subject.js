const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    code: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    streams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Stream' }],
}, { timestamps: true });

module.exports = mongoose.model('Subject', subjectSchema);