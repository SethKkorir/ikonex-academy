const express = require('express');
const app = express();
const connectDB = require('./server/src/config/db');

// Connect to the database
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('dev'));
app.use(helmet());

// Routes
app.use('/api', require('./server/src/routes/admin'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});  