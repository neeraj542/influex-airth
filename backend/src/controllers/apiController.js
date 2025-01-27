const axios = require('axios');

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
    // Send request to exchange the token
    const exchangeResponse = await axios.get(EXCHANGE_URL, {
      params: {
        grant_type: 'ig_exchange_token',
        client_secret: process.env.CLIENT_SECRET,
        access_token: shortLivedToken,
      },
    });

    console.log("Exchange Response:", exchangeResponse.data);

    const longLivedToken = exchangeResponse.data.access_token;

    const lambdaResponse = await axios.post(
      AWS_LAMBDA_API_URL,
      { access_token: longLivedToken }, 
      { headers: { 'Content-Type': 'application/json' } }
    );

    console.log("Lambda Response:", lambdaResponse.data);

    res.json({
      success: true,
      longLivedToken: exchangeResponse.data, 
      lambdaResponse: lambdaResponse.data, 
    });

  } catch (error) {
    const errorDetails = error.response?.data || error.message;
    console.error("Error Details:", errorDetails);

    res.status(500).json({
      error: 'An error occurred while processing the request.',
      details: errorDetails,
    });
  }
};
