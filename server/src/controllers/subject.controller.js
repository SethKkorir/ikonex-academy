const Subject = require('../models/Subject');

async function createSubject(req, res) {
    try {
        const subjectData = req.body;
        const subject = await Subject.create(subjectData);
        res.status(201).json(subject);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

async function getAllSubjects(req, res) {
    try {
        const subjects = await Subject.find().populate('streams', 'name');
        res.json(subjects);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

async function getSubject(req, res) {
    try {
        const subjectId = req.params.id;
        const subject = await Subject.findById(subjectId).populate('streams', 'name');
        if (!subject) {
            res.status(404).json({ message: 'Subject not found' });
            return;
        }
        res.json(subject);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

async function getSubjectsByStream(req, res) {
    try {
        const streamId = req.params.streamId;
        const subjects = await Subject.find({ streams: streamId });
        res.json(subjects);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

async function updateSubject(req, res) {
    try {
        const subjectId = req.params.id;
        const updateData = req.body;
        const subject = await Subject.findByIdAndUpdate(subjectId, updateData, { new: true });
        if (!subject) {
            res.status(404).json({ message: 'Subject not found' });
            return;
        }
        res.json(subject);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

async function deleteSubject(req, res) {
    try {
        const subjectId = req.params.id;
        const subject = await Subject.findByIdAndDelete(subjectId);
        if (!subject) {
            res.status(404).json({ message: 'Subject not found' });
            return;
        }
        res.json({ message: 'Subject deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

async function assignSubjectToStream(req, res) {
    try {
        const subjectId = req.params.id;
        const subject = await Subject.findById(subjectId);
        if (!subject) {
            res.status(404).json({ message: 'Subject not found' });
            return;
        }

        const streamId = req.body.streamId;
        const hasStream = subject.streams.includes(streamId);
        if (hasStream === false) {
            subject.streams.push(streamId);
            await subject.save();
        }
        res.json(subject);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

module.exports = {
    createSubject: createSubject,
    getAllSubjects: getAllSubjects,
    getSubject: getSubject,
    getSubjectsByStream: getSubjectsByStream,
    updateSubject: updateSubject,
    deleteSubject: deleteSubject,
    assignSubjectToStream: assignSubjectToStream
};