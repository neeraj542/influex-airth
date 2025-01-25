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
  
  // console.log("AWS_LAMBDA_API_URL", AWS_LAMBDA_API_URL);

  if (!AWS_LAMBDA_API_URL || !process.env.CLIENT_SECRET) {
    return res.status(500).json({ error: 'Server configuration is missing required environment variables.' });
  }

  try {
    // Send request to exchange the token
    // console.log("inside try block");
    const exchangeResponse = await axios.get(EXCHANGE_URL, {
      params: {
        grant_type: 'ig_exchange_token',
        client_secret: process.env.CLIENT_SECRET,
        access_token: shortLivedToken,
      },
    });

    const longLivedToken = exchangeResponse.data.access_token;
    // console.log('Long-Lived Token:', longLivedToken);

    const lambdaResponse = await axios.post(
      AWS_LAMBDA_API_URL,
      { access_token: longLivedToken }, // Payload for Lambda
      { headers: { 'Content-Type': 'application/json' } }
    );

    // console.log('AWS Lambda Response:', lambdaResponse.data);
    // res.json(response.data); // Contains long-lived access token and expiration

    res.json({
      success: true,
      longLivedToken: exchangeResponse.data, // Instagram token data
      lambdaResponse: lambdaResponse.data, // Lambda API response
    });

  } catch (error) {
    // console.error('Error occurred:', error.response?.data || error.message);
    const errorDetails = error.response?.data || error.message;

    res.status(500).json({
      error: 'An error occurred while processing the request.',
      details: errorDetails,
    });
  }
};

/**
 * Validates a long-lived Instagram access token and checks its expiration date.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 */
exports.checkTokenValidity = async (req, res) => {
  const longLivedToken = req.query.access_token;

  if (!longLivedToken) {
    return res.status(400).json({ error: 'Access token is missing!' });
  }
  const DEBUG_URL = 'https://graph.facebook.com/debug_token';
  // const appAccessToken = `${process.env.CLIENT_ID}|${process.env.CLIENT_SECRET}`;
  
  try {
    const response = await axios.get(DEBUG_URL, {
      params: {
        input_token: longLivedToken,
        access_token: process.env.CLIENT_SECRET,
      },
    });

    const data = response.data.data;
    const expiryDate = new Date(data.expires_at * 1000); // Convert expiration to readable format

    res.json({
      isValid: data.is_valid,
      expiresAt: expiryDate,
      scopes: data.scopes,
      userId: data.user_id,
    });
  } catch (error) {
    console.error('Error validating token:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to validate token.', details: error.response?.data });
  }
};