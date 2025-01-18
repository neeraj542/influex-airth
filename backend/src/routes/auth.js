const express = require('express');
const { login, redirect } = require('../controllers/authController');

const router = express.Router();

/**
 * Route to handle Instagram OAuth login.
 * Redirects the user to the Instagram authorization URL.
 * 
 * @name GET /auth/login
 * @function
 * @memberof module:authRoutes
 * @inner
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 */
router.get('/login', login);

/**
 * Route to handle Instagram OAuth redirect.
 * Exchanges the authorization code for an access token.
 * 
 * @name GET /auth/redirect
 * @function
 * @memberof module:authRoutes
 * @inner
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 */
router.get('/redirect', redirect);

module.exports = router;
