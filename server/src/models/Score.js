const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        required: true
    },
    stream: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Stream',
        required: true
    },
    examScore: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    caScore: {
        type: Number,
        required: true,
        min: 0,
        max: 30
    },
}, { timestamps: true });

// Ofcourse this will prevent duplicate score entries for same student + subject
scoreSchema.index({ student: 1, subject: 1 }, { unique: true });

module.exports = mongoose.model('Score', scoreSchema);