const axios = require('axios');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const nodemailer = require('nodemailer');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Create a transporter for sending emails (using Gmail as an example)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Redirects the user to the Instagram OAuth authorization URL.
 * 
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 */
const login = (req, res) => {
  const { CLIENT_ID, REDIRECT_URI } = process.env;

  const instagramAuthUrl = `https://www.instagram.com/oauth/authorize?` +
    `enable_fb_login=0&force_authentication=1&` +
    `client_id=${CLIENT_ID}&` +
    `redirect_uri=${encodeURIComponent(REDIRECT_URI)}&` +
    `response_type=code&` +
    `scope=instagram_business_basic,` +
    `instagram_business_manage_messages,` +
    `instagram_business_manage_comments,` +
    `instagram_business_content_publish`;

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
    // In loginUser function
    console.log('User found:', user);
    // console.log('Password match:', isMatch);

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

/**
 * Sends a password reset link to the user's email.
 */
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required.' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Generate reset token
    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Request',
      html: `
          <h3>Hello ${user.name},</h3>
          <p>You requested a password reset. Click the link below to reset your password:</p>
          <a href="${resetLink}">Reset Password</a>
          <p>If you didn't request this, please ignore this email.</p>
        `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Password reset link has been sent to your email.' });
  } catch (error) {
    res.status(500).json({ message: 'Error processing password reset request.', error: error.message });
  }
};

/**
 * Resets the user's password using the reset token.
 */
const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ message: 'Missing token or password.' });
  }

  try {
    // Decode the reset token to find the user
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    const user = await User.findByIdAndUpdate(userId, { password: hashedPassword });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    return res.status(200).json({ message: 'Password reset successfully.' });
  } catch (err) {
    return res.status(500).json({ message: 'Error resetting password.' });
  }
};



/**
 * Verifies the reset token for validity.
 */
const verifyResetToken = async (req, res) => {
  const { token } = req.body;

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(400).json({ message: 'Invalid or expired token.' });
    }

    try {
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(400).json({ message: 'User not found.' });
      }

      return res.status(200).json({ message: 'Token is valid.' });
    } catch (err) {
      return res.status(500).json({ message: 'Internal server error.' });
    }
  });
};

module.exports = {
  login,
  redirect,
  userSignup,
  loginUser,
  logoutUser,
  getProfile,
  forgotPassword,
  resetPassword,
  verifyResetToken
};





// const axios = require('axios');
// const jwt = require('jsonwebtoken');
// const User = require('../models/User');

// /**
//  * Redirects the user to the Instagram OAuth authorization URL.
//  * 
//  * @param {Object} req - The HTTP request object.
//  * @param {Object} res - The HTTP response object.
//  */
// const login = (req, res) => {
//   const { CLIENT_ID, REDIRECT_URI } = process.env;

//   const instagramAuthUrl = `https://www.instagram.com/oauth/authorize?` +
//     `enable_fb_login=0&force_authentication=1&` +
//     `client_id=${CLIENT_ID}&` +
//     `redirect_uri=${encodeURIComponent(REDIRECT_URI)}&` +
//     `response_type=code&` +
//     `scope=instagram_business_basic,` +
//     `instagram_business_manage_messages,` +
//     `instagram_business_manage_comments,` +
//     `instagram_business_content_publish`;

//   res.redirect(instagramAuthUrl);
// };



// /**
//  * Handles the Instagram OAuth redirect by exchanging the authorization code
//  * for an access token.
//  * 
//  * @param {Object} req - The HTTP request object.
//  * @param {Object} req.query - The query parameters of the request.
//  * @param {string} req.query.code - The authorization code returned by Instagram.
//  * @param {Object} res - The HTTP response object.
//  * @returns {Promise<void>} Sends a JSON response containing the access token and user ID, or an error message.
//  */
// const redirect = async (req, res) => {
//   const { code } = req.query;
//   console.log("code", code);
//   if (!code) {
//     return res.status(400).json({ error: 'Authorization code is missing.' });
//   }
  
//   try {
//     const tokenResponse = await axios.post('https://api.instagram.com/oauth/access_token', {
//       client_id: process.env.CLIENT_ID,
//       client_secret: process.env.CLIENT_SECRET,
//       grant_type: 'authorization_code',
//       redirect_uri: encodeURIComponent(process.env.REDIRECT_URI),
//       code,
//     });

//     const { access_token, user_id } = tokenResponse.data;
//     res.status(200).json({ access_token, user_id });
//   } catch (error) {
//     res.status(500).json({
//       error: 'Failed to exchange code for access token.',
//       details: error.response?.data || error.message,
//     });
//   }
// };

// /**
//  * Registers a new user.
//  * 
//  * @param {Object} req - The HTTP request object.
//  * @param {Object} res - The HTTP response object.
//  */
// const userSignup = async (req, res) => {
//   const { name, email, password } = req.body;

//   if (!name || !email || !password) {
//     return res.status(400).json({ message: 'All fields are required.' });
//   }

//   try {
//     const userExists = await User.findOne({ email });

//     if (userExists) {
//       return res.status(400).json({ message: 'User already exists.' });
//     }

//     const user = await User.create({ name, email, password });

//     res.status(201).json({
//       token: generateToken(user._id),
//       user,
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: 'Error registering user.',
//       error: error.message,
//     });
//   }
// };

// /**
//  * Logs in an existing user.
//  * 
//  * @param {Object} req - The HTTP request object.
//  * @param {Object} res - The HTTP response object.
//  */
// const loginUser = async (req, res) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     return res.status(400).json({ message: 'Email and password are required.' });
//   }

//   try {
//     const user = await User.findOne({ email });

//     if (!user || !(await user.matchPassword(password))) {
//       return res.status(401).json({ message: 'Invalid credentials.' });
//     }

//     res.status(200).json({
//       token: generateToken(user._id),
//       user,
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: 'Error logging in user.',
//       error: error.message,
//     });
//   }
// };


// /**
//  * Logs out a user by sending a success message. 
//  * 
//  * Note: Since JWT is stateless, logging out involves the client removing the token. 
//  * This endpoint serves as an acknowledgment for the logout action.
//  * 
//  * @param {Object} req - The HTTP request object.
//  * @param {Object} res - The HTTP response object.
//  * @returns {void} Sends a JSON response with a success message.
//  */
// const logoutUser = (req, res) => {
//   res.status(200).json({ message: 'User logged out successfully.' });
// };

// const getProfile = async (req, res) => {
//   try {
//     const user = req.user; // User is already attached by the middleware
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     res.json(user);
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// };

// module.exports = {
//   login,
//   redirect,
//   userSignup,
//   loginUser,
//   logoutUser,
//   getProfile,
// };
