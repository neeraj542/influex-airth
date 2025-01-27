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
// exports.exchangeLongLivedToken = async (req, res) => {
//   const shortLivedToken = req.query.access_token;
//   console.log("Received short-lived token:", shortLivedToken); // Log the received short-lived token

//   if (!shortLivedToken) {
//     console.log("Error: Access token is missing");
//     return res.status(400).json({ error: 'Access token is missing!' });
//   }

//   const EXCHANGE_URL = 'https://graph.instagram.com/access_token';
//   const AWS_LAMBDA_API_URL = process.env.AWS_LAMBDA_API_URL;

//   if (!AWS_LAMBDA_API_URL || !process.env.CLIENT_SECRET) {
//     console.log("Error: Missing environment variables");
//     return res.status(500).json({ error: 'Server configuration is missing required environment variables.' });
//   }

//   try {
//     console.log("Making request to Instagram to exchange short-lived token...");
//     // Make the request to Instagram to exchange the short-lived token for a long-lived token
//     const exchangeResponse = await axios.get(EXCHANGE_URL, {
//       params: {
//         grant_type: 'ig_exchange_token',
//         client_secret: process.env.CLIENT_SECRET,
//         access_token: shortLivedToken,
//       },
//     });
    
//     console.log("Instagram response:", exchangeResponse.data); // Log the Instagram response

//     const longLivedToken = exchangeResponse.data.access_token;

//     console.log("Received long-lived token:", longLivedToken); // Log the long-lived token

//     // Call AWS Lambda with the long-lived token
//     const lambdaResponse = await axios.post(
//       AWS_LAMBDA_API_URL,
//       { access_token: longLivedToken },
//       { headers: { 'Content-Type': 'application/json' } }
//     );
    
//     // console.log("Lambda response:", lambdaResponse.data); // Log the Lambda response

//     // Send the response back to the client
//     res.json({
//       success: true,
//       longLivedToken: exchangeResponse.data,
//       lambdaResponse: lambdaResponse.data,
//     });

//   } catch (error) {
//     console.error("Error exchanging token:", error); // Log any errors that occur

//     const errorDetails = error.response?.data || error.message;
//     res.status(500).json({
//       error: 'An error occurred while processing the request.',
//       details: errorDetails,
//     });
//   }
// };


async function getLongLivedToken(shortLivedToken) {
  const EXCHANGE_URL = 'https://graph.instagram.com/access_token';

  try {
    const response = await axios.get(EXCHANGE_URL, {
      params: {
        grant_type: 'ig_exchange_token',
        client_secret: process.env.CLIENT_SECRET,
        access_token: shortLivedToken,
      },
    });

    return response.data.access_token;
  } catch (error) {
    throw new Error(`Failed to get long-lived token: ${error.response?.data?.error_message || error.message}`);
  }
}

async function callAWSLambda(longLivedToken) {
  const AWS_LAMBDA_API_URL = process.env.AWS_LAMBDA_API_URL;

  try {
    const response = await axios.post(
      AWS_LAMBDA_API_URL,
      { access_token: longLivedToken },
      { headers: { 'Content-Type': 'application/json' } }
    );

    return response.data;
  } catch (error) {
    throw new Error(`Failed to call AWS Lambda: ${error.response?.data?.error_message || error.message}`);
  }
}

exports.exchangeLongLivedToken = async (req, res) => {
  const shortLivedToken = req.query.access_token;
  console.log("Received short-lived token:", shortLivedToken);

  if (!shortLivedToken) {
    return res.status(400).json({ error: 'Access token is missing!' });
  }

  try {
    const longLivedToken = await getLongLivedToken(shortLivedToken);
    console.log("Received long-lived token:", longLivedToken);

    const lambdaResponse = await callAWSLambda(longLivedToken);
    console.log("Lambda response:", lambdaResponse);

    res.json({
      success: true,
      longLivedToken,
      lambdaResponse,
    });
  } catch (error) {
    console.error("Error exchanging token:", error.message);
    res.status(500).json({
      error: 'An error occurred while processing the request.',
      details: error.message,
    });
  }
};
