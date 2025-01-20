const express = require('express');
const { exchangeToken } = require('../controllers/apiController');

const router = express.Router();

/**
 * Route to exchange the authorization code for an access token.
 * 
 * @name GET /api/exchange-token
 * @function
 * @memberof module:apiRoutes
 * @inner
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 */
router.get('/exchange-token', exchangeToken);

module.exports = router;

