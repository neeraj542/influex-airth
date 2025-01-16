const axios = require('axios');

console.log(process.env)
// Redirect to Instagram OAuth URL
const login = (req, res) => {
    // console.log(INSTAGRAM_CLIENT_ID)
    console.log("redirect " + process.env.REDIRECT_URI)

    const instagramAuthUrl = `https://www.instagram.com/oauth/authorize?client_id=${process.env.INSTAGRAM_CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}&response_type=code&scope=instagram_business_basic,instagram_business_manage_messages,instagram_business_manage_comments,instagram_business_content_publish`;
    console.log("ig-url" + instagramAuthUrl)
    res.redirect(instagramAuthUrl);
};

// Handle Instagram Redirect (Exchange Code for Access Token)
const redirect = async (req, res) => {
    const { code } = req.query;

    try {
        const tokenResponse = await axios.post('https://api.instagram.com/oauth/access_token', {
            client_id: process.env.INSTAGRAM_CLIENT_ID,
            client_secret: process.env.INSTAGRAM_CLIENT_SECRET,
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
