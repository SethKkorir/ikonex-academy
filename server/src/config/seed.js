const mongoose = require('mongoose');
const Stream = require('../models/Stream');
const Subject = require('../models/Subject');
const Student = require('../models/Student');
const Score = require('../models/Score');

async function seedDB() {
    try {
        const streamCount = await Stream.countDocuments();
        if (streamCount > 0) {
            console.log("Database already seeded");
            return;
        }

        console.log("Seeding database with default records...");

        const streamsData = [
            { name: "Stream A" },
            { name: "Stream B" },
            { name: "Stream C" },
            { name: "Stream D" },
            { name: "Stream E" },
            { name: "Stream F" }
        ];
        const streams = await Stream.insertMany(streamsData);
        console.log("Created streams: " + streams.length);

        const subjectsData = [
            { name: "Mathematics", code: "MAT101", streams: [streams[0]._id, streams[1]._id] },
            { name: "English Language", code: "ENG101", streams: [streams[0]._id, streams[1]._id] },
            { name: "Physics", code: "PHY101", streams: [streams[2]._id, streams[3]._id] },
            { name: "Chemistry", code: "CHE101", streams: [streams[2]._id, streams[4]._id] },
            { name: "Biology", code: "BIO101", streams: [streams[4]._id, streams[5]._id] },
            { name: "History", code: "HIS101", streams: [streams[3]._id, streams[5]._id] }
        ];
        const subjects = await Subject.insertMany(subjectsData);
        console.log("Created subjects: " + subjects.length);

        const studentsData = [
            { name: "John Doe", dob: new Date("2010-05-15"), gender: "Male", stream: streams[0]._id },
            { name: "Jane Smith", dob: new Date("2010-08-20"), gender: "Female", stream: streams[0]._id },
            { name: "Michael Brown", dob: new Date("2010-11-02"), gender: "Male", stream: streams[1]._id },
            { name: "Sarah Wilson", dob: new Date("2010-02-14"), gender: "Female", stream: streams[1]._id },
            { name: "David Johnson", dob: new Date("2010-07-22"), gender: "Male", stream: streams[2]._id },
            { name: "Emma Davis", dob: new Date("2010-09-30"), gender: "Female", stream: streams[2]._id },
            { name: "Daniel Wilson", dob: new Date("2010-12-12"), gender: "Male", stream: streams[3]._id },
            { name: "Olivia Taylor", dob: new Date("2010-04-18"), gender: "Female", stream: streams[3]._id },
            { name: "James Anderson", dob: new Date("2010-01-25"), gender: "Male", stream: streams[4]._id },
            { name: "Sophia Thomas", dob: new Date("2010-06-05"), gender: "Female", stream: streams[4]._id },
            { name: "Lucas Martin", dob: new Date("2010-03-09"), gender: "Male", stream: streams[5]._id },
            { name: "Mia Garcia", dob: new Date("2010-10-15"), gender: "Female", stream: streams[5]._id }
        ];
        const insertedStudents = await Student.insertMany(studentsData);
        console.log("Created students: " + insertedStudents.length);

        const scoresData = [
            { student: insertedStudents[0]._id, subject: subjects[0]._id, stream: streams[0]._id, examScore: 65, caScore: 20 },
            { student: insertedStudents[0]._id, subject: subjects[1]._id, stream: streams[0]._id, examScore: 58, caScore: 20 },
            { student: insertedStudents[1]._id, subject: subjects[0]._id, stream: streams[0]._id, examScore: 68, caScore: 24 },
            { student: insertedStudents[1]._id, subject: subjects[2]._id, stream: streams[0]._id, examScore: 65, caScore: 23 },
            { student: insertedStudents[2]._id, subject: subjects[0]._id, stream: streams[1]._id, examScore: 55, caScore: 19 },
            { student: insertedStudents[2]._id, subject: subjects[3]._id, stream: streams[1]._id, examScore: 50, caScore: 15 },
            { student: insertedStudents[3]._id, subject: subjects[1]._id, stream: streams[1]._id, examScore: 61, caScore: 20 },
            { student: insertedStudents[3]._id, subject: subjects[4]._id, stream: streams[1]._id, examScore: 56, caScore: 20 },
            { student: insertedStudents[4]._id, subject: subjects[2]._id, stream: streams[2]._id, examScore: 48, caScore: 14 },
            { student: insertedStudents[4]._id, subject: subjects[3]._id, stream: streams[2]._id, examScore: 43, caScore: 15 },
            { student: insertedStudents[5]._id, subject: subjects[1]._id, stream: streams[2]._id, examScore: 72, caScore: 23 },
            { student: insertedStudents[5]._id, subject: subjects[5]._id, stream: streams[2]._id, examScore: 69, caScore: 20 },
            { student: insertedStudents[6]._id, subject: subjects[0]._id, stream: streams[3]._id, examScore: 30, caScore: 15 },
            { student: insertedStudents[6]._id, subject: subjects[4]._id, stream: streams[3]._id, examScore: 38, caScore: 14 },
            { student: insertedStudents[7]._id, subject: subjects[1]._id, stream: streams[3]._id, examScore: 52, caScore: 18 },
            { student: insertedStudents[7]._id, subject: subjects[5]._id, stream: streams[3]._id, examScore: 53, caScore: 20 },
            { student: insertedStudents[8]._id, subject: subjects[2]._id, stream: streams[4]._id, examScore: 40, caScore: 15 },
            { student: insertedStudents[8]._id, subject: subjects[3]._id, stream: streams[4]._id, examScore: 36, caScore: 12 },
            { student: insertedStudents[9]._id, subject: subjects[1]._id, stream: streams[4]._id, examScore: 68, caScore: 20 },
            { student: insertedStudents[9]._id, subject: subjects[4]._id, stream: streams[4]._id, examScore: 62, caScore: 22 },
            { student: insertedStudents[10]._id, subject: subjects[0]._id, stream: streams[5]._id, examScore: 45, caScore: 15 },
            { student: insertedStudents[10]._id, subject: subjects[5]._id, stream: streams[5]._id, examScore: 47, caScore: 15 },
            { student: insertedStudents[11]._id, subject: subjects[1]._id, stream: streams[5]._id, examScore: 55, caScore: 20 },
            { student: insertedStudents[11]._id, subject: subjects[2]._id, stream: streams[5]._id, examScore: 57, caScore: 20 }
        ];

        await Score.insertMany(scoresData);
        console.log("Database seeded successfully!");
    } catch (error) {
        console.log("Error seeding database", error);
    }
}

module.exports = seedDB;
