require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const connectDB = require('./server/src/config/db');

const app = express();

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('dev'));
app.use(helmet());

const streamRoutes = require('./server/src/routes/stream.routes');
const studentRoutes = require('./server/src/routes/student.routes');
const subjectRoutes = require('./server/src/routes/subject.routes');
const scoreRoutes = require('./server/src/routes/score.routes');
const resultsRoutes = require('./server/src/routes/results.routes');

app.use('/api/streams', streamRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/scores', scoreRoutes);
app.use('/api/results', resultsRoutes);

const portNumber = process.env.PORT || 5000;

app.listen(portNumber, function () {
    console.log("Server running on port " + portNumber);
});