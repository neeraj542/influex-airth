const axios = require('axios');

/**
 * Redirects the user to the Instagram OAuth authorization URL.
 * 
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 */
const login = (req, res) => {
    const instagramAuthUrl = `https://www.instagram.com/oauth/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}&response_type=code&scope=instagram_business_basic,instagram_business_manage_messages,instagram_business_manage_comments,instagram_business_content_publish`;
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
    try {
        const tokenResponse = await axios.post('https://api.instagram.com/oauth/access_token', {
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            grant_type: 'authorization_code',
            redirect_uri: process.env.REDIRECT_URI,
            code,
        });

        const { access_token, user_id } = tokenResponse?.data;
        res.json({ access_token, user_id });
    } catch (error) {
        res.status(500).json({ error: 'Failed to exchange code for access token.', details: error.response?.data });
    }
};

module.exports = { login, redirect };
