const express = require('express');
const { 
    exchangeToken, 
    exchangeLongLivedToken
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

router.post('/submit-form', (req, res) => {
    const formData = req.body;
    const accessToken = req.headers.authorization;
    const AWS_LAMBDA_API_URL = process.env.AWS_LAMBDA_API_URL;

    axios.post(AWS_LAMBDA_API_URL, formData, {
        headers: {
            'Authorization': accessToken,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        res.status(200).json(response.data);
    })
    .catch(error => {
        res.status(500).json({ error: error.message });
    });
});


module.exports = router;
