const express = require('express');
const { exchangeToken, getUserInfo } = require('../controllers/apiController');

const router = express.Router();

// Route to exchange auth code for access token
router.get('/exchange-token', exchangeToken);

// Route to fetch user info using access token
router.get('/user-info', getUserInfo);

module.exports = router;
