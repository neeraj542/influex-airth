const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');

dotenv.config();
const authRoutes = require('./src/routes/auth');
const apiRoutes = require('./src/routes/api');

const app = express();

/**
 * Middleware to parse incoming JSON request bodies.
 */
app.use(bodyParser.json());

/**
 * Middleware to enable Cross-Origin Resource Sharing (CORS).
 */
app.use(cors());

/**
 * Routes for authentication-related functionality.
 * @module authRoutes
 */
app.use('/auth', authRoutes);

/**
 * Routes for API-related functionality.
 * @module apiRoutes
 */
app.use('/api', apiRoutes);

/**
 * Root route handler.
 * Sends a simple response to indicate the server is running.
 * 
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 */
app.get('/', (req, res) => {
    res.send('Instagram OAuth Backend Running');
});

// Define the port on which the server will run
const PORT = process.env.PORT || 3000;

/**
 * Starts the server and listens on the specified port.
 * Logs a message indicating the server is running and accessible.
 */
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
