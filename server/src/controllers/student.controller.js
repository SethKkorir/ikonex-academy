const Student = require('../models/Student');

async function createStudent(req, res) {
    try {
        const studentData = req.body;
        const student = await Student.create(studentData);
        res.status(201).json(student);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

async function getAllStudents(req, res) {
    try {
        const studentList = await Student.find()
            .populate('stream', 'name')
            .sort({ createdAt: -1 });
        res.json(studentList);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

async function getStudent(req, res) {
    try {
        const studentId = req.params.id;
        const student = await Student.findById(studentId).populate('stream', 'name');
        if (!student) {
            res.status(404).json({ message: 'Student not found' });
            return;
        }
        res.json(student);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

async function getStudentsByStream(req, res) {
    try {
        const streamId = req.params.streamId;
        const studentList = await Student.find({ stream: streamId }).populate('stream', 'name');
        res.json(studentList);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

async function updateStudent(req, res) {
    try {
        const studentId = req.params.id;
        const updateData = req.body;
        const student = await Student.findByIdAndUpdate(studentId, updateData, { new: true });
        if (!student) {
            res.status(404).json({ message: 'Student not found' });
            return;
        }
        res.json(student);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

async function deleteStudent(req, res) {
    try {
        const studentId = req.params.id;
        const student = await Student.findByIdAndDelete(studentId);
        if (!student) {
            res.status(404).json({ message: 'Student not found' });
            return;
        }
        res.json({ message: 'Student deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

module.exports = {
    createStudent: createStudent,
    getAllStudents: getAllStudents,
    getStudent: getStudent,
    getStudentsByStream: getStudentsByStream,
    updateStudent: updateStudent,
    deleteStudent: deleteStudent
};