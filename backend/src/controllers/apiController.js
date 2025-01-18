const axios = require('axios');
// const { clientId, clientSecret, redirectUri } = require('../config/credentials');

/**
 * Exchanges an authorization code obtained from Instagram for an access token.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 *
 * @returns {Promise} A promise that resolves with the access token data or rejects with an error.
 */
exports.exchangeToken = async (req, res) => {
  const authCode = req.query.code;
  if (!authCode || typeof authCode !== 'string') {
    return res.status(400).send('Authorization code is invalid!');
  }

  const TOKEN_URL = 'https://api.instagram.com/oauth/access_token';
  const payload = {
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    grant_type: 'authorization_code',
    redirect_uri: process.env.REDIRECT_URI,
    code: authCode,
  };

  try {
    const encodedRes = new URLSearchParams(payload);
    const response = await axios.post(TOKEN_URL, encodedRes, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).send(`Error exchanging token: ${error.response?.data?.error_message || error.message}`);
  }
};
