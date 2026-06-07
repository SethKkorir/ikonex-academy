const mongoose = require('mongoose');

async function connectDB() {
    const mongoUri = process.env.MONGO_URI;
    try {
        await mongoose.connect(mongoUri);
        console.log("Database connected successfully");
        const seedDB = require('./seed');
        await seedDB();
    } catch (error) {
        console.log("Database connection failed", error);
        process.exit(1);
    }
}

module.exports = connectDB;