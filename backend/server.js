const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');

dotenv.config();
const authRoutes = require('./src/routes/auth');
const apiRoutes = require('./src/routes/api');

// Initialize the app
const app = express();

/**
 * CORS configuration.
 */
const corsOptions = {
    origin: [process.env.FRONTEND_URL, 'http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 86400,
};
app.use(cors(corsOptions));
// app.options('*', cors(corsOptions));

/**
 * Middleware to parse incoming JSON request bodies.
 */
app.use(bodyParser.json());

/**
 * Serve static files from the "public" directory in production.
 */
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'public')));
}

/**
 * Connect to MongoDB.
 */
const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));

/*
 * Routes.
 */
app.use('/auth', authRoutes);
app.use('/api', apiRoutes);

/**
 * Root route handler.
 */
app.get('/', (req, res) => {
    res.send('Instagram OAuth Backend Running');
});

// Handle unmatched routes in production
if (process.env.NODE_ENV === 'production') {
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
    });
}

// Define the port on which the server will run
const PORT = process.env.PORT || 3000;

/**
 * Starts the server and listens on the specified port.
 */
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
