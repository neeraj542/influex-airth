const axios = require('axios');
const { clientId, clientSecret, redirectUri } = require('../config/credentials');

exports.exchangeToken = async (req, res) => {
  const authCode = req.query.code;

  if (!authCode) {
    return res.status(400).send('Authorization code is missing!');
  }

  const TOKEN_URL = 'https://api.instagram.com/oauth/access_token';
  const payload = {
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: 'authorization_code',
    redirect_uri: redirectUri,
    code: authCode,
  };

  try {
    const response = await axios.post(TOKEN_URL, new URLSearchParams(payload));
    res.json(response.data);
  } catch (error) {
    res.status(500).send(`Error exchanging token: ${error.response.data.error_message}`);
  }
};

exports.getUserInfo = async (req, res) => {
  const accessToken = req.query.access_token;

  if (!accessToken) {
    return res.status(400).send('Access token is missing!');
  }

  const API_URL = 'https://graph.facebook.com/v15.0/me';
  const params = {
    fields: 'id,username',
    access_token: accessToken,
  };

  try {
    const response = await axios.get(API_URL, { params });
    res.json(response.data);
  } catch (error) {
    res.status(500).send(`Error fetching user info: ${error.response.data.error.message}`);
  }
};
