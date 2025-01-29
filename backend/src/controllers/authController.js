const axios = require('axios');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Redirects the user to the Instagram OAuth authorization URL.
 * 
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 */
const login = (req, res) => {
  const instagramAuthUrl = `https://www.instagram.com/oauth/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.REDIRECT_URI)}&response_type=code&scope=instagram_business_basic,instagram_business_manage_messages,instagram_business_manage_comments,instagram_business_content_publish`;
  res.redirect(instagramAuthUrl);
};


/**
 * Handles the Instagram OAuth redirect by exchanging the authorization code
 * for an access token.
 * 
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.query - The query parameters of the request.
 * @param {string} req.query.code - The authorization code returned by Instagram.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} Sends a JSON response containing the access token and user ID, or an error message.
 */
const redirect = async (req, res) => {
  const { code } = req.query;
  console.log("code", code);
  if (!code) {
    return res.status(400).json({ error: 'Authorization code is missing.' });
  }
  
  try {
    const tokenResponse = await axios.post('https://api.instagram.com/oauth/access_token', {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      grant_type: 'authorization_code',
      redirect_uri: encodeURIComponent(process.env.REDIRECT_URI),
      code,
    });

    const { access_token, user_id } = tokenResponse.data;
    res.status(200).json({ access_token, user_id });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to exchange code for access token.',
      details: error.response?.data || error.message,
    });
  }
};

/**
 * Registers a new user.
 * 
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 */
const userSignup = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists.' });
    }

    const user = await User.create({ name, email, password });

    res.status(201).json({
      token: generateToken(user._id),
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error registering user.',
      error: error.message,
    });
  }
};

/**
 * Logs in an existing user.
 * 
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 */
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    res.status(200).json({
      token: generateToken(user._id),
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error logging in user.',
      error: error.message,
    });
  }
};


/**
 * Logs out a user by sending a success message. 
 * 
 * Note: Since JWT is stateless, logging out involves the client removing the token. 
 * This endpoint serves as an acknowledgment for the logout action.
 * 
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {void} Sends a JSON response with a success message.
 */
const logoutUser = (req, res) => {
  res.status(200).json({ message: 'User logged out successfully.' });
};

const getProfile = async (req, res) => {
  try {
    const user = req.user; // User is already attached by the middleware
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  login,
  redirect,
  userSignup,
  loginUser,
  logoutUser,
  getProfile,
};
