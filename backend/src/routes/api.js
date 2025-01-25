const express = require('express');
const { 
    exchangeToken, 
    exchangeLongLivedToken, 
    checkTokenValidity
} = require('../controllers/apiController');

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

/**
 * Route to exchange short-lived token for long-lived token.
 * 
 * @name GET /api/exchange-long-lived-token
 * @function
 * @memberof module:apiRoutes
 * @inner
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 */
router.get('/exchange-long-lived-token', exchangeLongLivedToken);

/**
 * Route to check the validity of a long-lived token.
 * 
 * @name GET /api/check-token-validity
 * @function
 * @memberof module:apiRoutes
 * @inner
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 */
router.get('/check-token-validity', checkTokenValidity);

module.exports = router;
