const Score = require('../models/Score');
const Student = require('../models/Student');

function getGrade(total) {
    if (total >= 70) {
        return 'A';
    }
    if (total >= 60) {
        return 'B';
    }
    if (total >= 50) {
        return 'C';
    }
    if (total >= 40) {
        return 'D';
    }
    return 'F';
}

async function getStudentResults(req, res) {
    try {
        const studentId = req.params.studentId;
        const scores = await Score.find({ student: studentId }).populate('subject', 'name code');

        const results = [];
        let totalMarks = 0;
        
        for (let i = 0; i < scores.length; i++) {
            const currentScore = scores[i];
            const sumOfScores = currentScore.examScore + currentScore.caScore;
            
            results.push({
                subject: currentScore.subject.name,
                code: currentScore.subject.code,
                examScore: currentScore.examScore,
                caScore: currentScore.caScore,
                total: sumOfScores,
                grade: getGrade(sumOfScores)
            });
            totalMarks = totalMarks + sumOfScores;
        }

        let average = 0;
        if (results.length > 0) {
            average = (totalMarks / results.length).toFixed(2);
        }

        res.json({
            results: results,
            totalMarks: totalMarks,
            average: average,
            grade: getGrade(average)
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

async function getStreamResults(req, res) {
    try {
        const streamId = req.params.streamId;
        const students = await Student.find({ stream: streamId });

        const streamResults = [];

        for (let i = 0; i < students.length; i++) {
            const student = students[i];
            const scores = await Score.find({ student: student._id }).populate('subject', 'name code');

            const results = [];
            let totalMarks = 0;

            for (let j = 0; j < scores.length; j++) {
                const currentScore = scores[j];
                const sumOfScores = currentScore.examScore + currentScore.caScore;

                results.push({
                    subject: currentScore.subject.name,
                    code: currentScore.subject.code,
                    examScore: currentScore.examScore,
                    caScore: currentScore.caScore,
                    total: sumOfScores,
                    grade: getGrade(sumOfScores)
                });
                totalMarks = totalMarks + sumOfScores;
            }

            let average = 0;
            if (results.length > 0) {
                average = (totalMarks / results.length).toFixed(2);
            }

            streamResults.push({
                student: {
                    id: student._id,
                    name: student.name
                },
                results: results,
                totalMarks: totalMarks,
                average: average,
                grade: getGrade(Number(average))
            });
        }

        streamResults.sort(function (a, b) {
            return b.totalMarks - a.totalMarks;
        });

        for (let i = 0; i < streamResults.length; i++) {
            streamResults[i].position = i + 1;
        }

        res.json(streamResults);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

module.exports = {
    getStudentResults: getStudentResults,
    getStreamResults: getStreamResults
};