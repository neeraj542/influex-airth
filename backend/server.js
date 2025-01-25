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
 * Connect to MongoDB
 */
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB:', err));


/**
 * CORS configuration.
 */


// origin: [process.env.FRONTEND_URL || 'http://localhost:5174', 'https://item-list-manager-neeraj542.vercel.app']
const corsOptions = {
    origin: [process.env.FRONTEND_URL || 'http://localhost:5174', 'https://item-list-manager-neeraj542.vercel.app'], // Allow specific origins from .env or default to all
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
};

// Apply CORS middleware with options
app.use(cors(corsOptions));

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
 * Routes for authentication-related functionality.
 */
app.use('/auth', authRoutes);

/**
 * Routes for API-related functionality.
 */
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
