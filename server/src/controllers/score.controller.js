const Score = require('../models/Score');

async function getAllScores(req, res) {
    try {
        const scoreList = await Score.find()
            .populate('student', 'name')
            .populate('subject', 'name code')
            .populate('stream', 'name');
        res.json(scoreList);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

async function createScore(req, res) {
    try {
        const newScore = await Score.create(req.body);
        res.status(201).json(newScore);
    } catch (err) {
        if (err.code === 11000) {
            res.status(400).json({ message: 'Score already exists for this student and subject' });
            return;
        }
        res.status(400).json({ message: err.message });
    }
}

async function updateScore(req, res) {
    try {
        const scoreId = req.params.id;
        const updateData = req.body;
        const updatedScore = await Score.findByIdAndUpdate(scoreId, updateData, { new: true });
        if (!updatedScore) {
            res.status(404).json({ message: 'Score not found' });
            return;
        }
        res.json(updatedScore);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

async function deleteScore(req, res) {
    try {
        const scoreId = req.params.id;
        const deletedScore = await Score.findByIdAndDelete(scoreId);
        if (!deletedScore) {
            res.status(404).json({ message: 'Score not found' });
            return;
        }
        res.json({ message: 'Score deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

async function getScoresByStudent(req, res) {
    try {
        const studentId = req.params.studentId;
        const studentScores = await Score.find({ student: studentId })
            .populate('subject', 'name code')
            .populate('stream', 'name');
        res.json(studentScores);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

async function getScoresByClassAndSubject(req, res) {
    try {
        const streamId = req.params.streamId;
        const subjectId = req.params.subjectId;
        const classScores = await Score.find({
            stream: streamId,
            subject: subjectId
        }).populate('student', 'name').populate('subject', 'name code');
        res.json(classScores);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

module.exports = {
    getAllScores: getAllScores,
    createScore: createScore,
    updateScore: updateScore,
    deleteScore: deleteScore,
    getScoresByStudent: getScoresByStudent,
    getScoresByClassAndSubject: getScoresByClassAndSubject
};