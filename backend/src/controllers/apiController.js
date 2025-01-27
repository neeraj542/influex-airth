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
  // console.log("authCode ", authCode);
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


/**
 * Exchanges a short-lived Instagram access token for a long-lived access token.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 */
exports.exchangeLongLivedToken = async (req, res) => {
  const shortLivedToken = req.query.access_token;

  if (!shortLivedToken) {
    return res.status(400).json({ error: 'Access token is missing!' });
  }

  const EXCHANGE_URL = 'https://graph.instagram.com/access_token';
  const AWS_LAMBDA_API_URL = process.env.AWS_LAMBDA_API_URL;
  
  if (!AWS_LAMBDA_API_URL || !process.env.CLIENT_SECRET) {
    return res.status(500).json({ error: 'Server configuration is missing required environment variables.' });
  }

  try {
    const exchangeResponse = await axios.get(EXCHANGE_URL, {
      params: {
        grant_type: 'ig_exchange_token',
        client_secret: process.env.CLIENT_SECRET,
        access_token: shortLivedToken,
      },
    });

    const longLivedToken = exchangeResponse.data.access_token;

    const lambdaResponse = await axios.post(
      AWS_LAMBDA_API_URL,
      { access_token: longLivedToken }, 
      { headers: { 'Content-Type': 'application/json' } }
    );

    res.json({
      success: true,
      longLivedToken: exchangeResponse.data, 
      lambdaResponse: lambdaResponse.data, 
    });

  } catch (error) {
    const errorDetails = error.response?.data || error.message;

    res.status(500).json({
      error: 'An error occurred while processing the request.',
      details: errorDetails,
    });
  }
};
