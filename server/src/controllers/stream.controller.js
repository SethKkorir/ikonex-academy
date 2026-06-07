const Stream = require('../models/Stream');

async function createStream(req, res) {
    try {
        const streamData = {
            name: req.body.name
        };
        const stream = await Stream.create(streamData);
        res.status(201).json(stream);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

async function getAllStreams(req, res) {
    try {
        const streams = await Stream.find().sort({ createdAt: -1 });
        res.json(streams);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

async function getStream(req, res) {
    try {
        const streamId = req.params.id;
        const stream = await Stream.findById(streamId);
        if (!stream) {
            res.status(404).json({ message: 'Stream not found' });
            return;
        }
        res.json(stream);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

async function updateStream(req, res) {
    try {
        const streamId = req.params.id;
        const updateData = {
            name: req.body.name
        };
        const stream = await Stream.findByIdAndUpdate(streamId, updateData, { new: true });
        if (!stream) {
            res.status(404).json({ message: 'Stream not found' });
            return;
        }
        res.json(stream);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

async function deleteStream(req, res) {
    try {
        const streamId = req.params.id;
        const stream = await Stream.findByIdAndDelete(streamId);
        if (!stream) {
            res.status(404).json({ message: 'Stream not found' });
            return;
        }
        res.json({ message: 'Stream deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

module.exports = {
    createStream: createStream,
    getAllStreams: getAllStreams,
    getStream: getStream,
    updateStream: updateStream,
    deleteStream: deleteStream
};