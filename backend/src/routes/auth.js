const express = require('express');
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();
const {
    login,
    redirect,
    userSignup,
    loginUser,
    logoutUser,
    getProfile,
    forgotPassword,
    resetPassword,
    verifyResetToken
} = require('../controllers/authController');

/**
 * Route to handle Instagram OAuth login.
 * Redirects the user to the Instagram authorization URL.
 * 
 * @name GET /auth/login
 * @function
 * @memberof module:authRoutes
 * @inner
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 */
router.get('/login', login);

/**
 * Route to handle Instagram OAuth redirect.
 * Exchanges the authorization code for an access token.
 * 
 * @name GET /auth/redirect
 * @function
 * @memberof module:authRoutes
 * @inner
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 */
router.get('/redirect', redirect);

/**
 * Route to register a new user.
 * 
 * @name POST /auth/register
 * @function
 * @memberof module:authRoutes
 * @inner
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 */
router.post('/signup', userSignup);

/**
 * Route to login an existing user.
 * 
 * @name POST /auth/login-user
 * @function
 * @memberof module:authRoutes
 * @inner
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 */
router.post('/login-user', loginUser);

/**
 * Route to logout an existing user.
 * 
 * @name POST /auth/logout-user
 * @function
 * @memberof module:authRoutes
 * @inner
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 */
router.post('/logout-user', authMiddleware, logoutUser);

/**
 * Route to get the user's profile.
 * This route requires the user to be authenticated.
 * 
 * @name GET /auth/profile
 * @function
 * @memberof module:authRoutes
 * @inner
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 */
router.get('/profile', authMiddleware, getProfile);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post('/verify-reset-token', verifyResetToken);

module.exports = router;
// ------------------------ ------------------------ ------------------------ ------------------------ ------------------------ 




// const express = require('express');
// const { login, redirect, userSignup, loginUser, logoutUser,getProfile } = require('../controllers/authController');
// const authMiddleware = require("../middleware/authMiddleware");
// const router = express.Router();

// /**
//  * Route to handle Instagram OAuth login.
//  * Redirects the user to the Instagram authorization URL.
//  * 
//  * @name GET /auth/login
//  * @function
//  * @memberof module:authRoutes
//  * @inner
//  * @param {Object} req - The HTTP request object.
//  * @param {Object} res - The HTTP response object.
//  */
// router.get('/login', login);

// /**
//  * Route to handle Instagram OAuth redirect.
//  * Exchanges the authorization code for an access token.
//  * 
//  * @name GET /auth/redirect
//  * @function
//  * @memberof module:authRoutes
//  * @inner
//  * @param {Object} req - The HTTP request object.
//  * @param {Object} res - The HTTP response object.
//  */
// router.get('/redirect', redirect);

// /**
//  * Route to register a new user.
//  * 
//  * @name POST /auth/register
//  * @function
//  * @memberof module:authRoutes
//  * @inner
//  * @param {Object} req - The HTTP request object.
//  * @param {Object} res - The HTTP response object.
//  */
// router.post('/signup', userSignup);

// /**
//  * Route to login an existing user.
//  * 
//  * @name POST /auth/login-user
//  * @function
//  * @memberof module:authRoutes
//  * @inner
//  * @param {Object} req - The HTTP request object.
//  * @param {Object} res - The HTTP response object.
//  */
// router.post('/login-user', loginUser);

// /**
//  * Route to logout an existing user.
//  * 
//  * @name POST /auth/logout-user
//  * @function
//  * @memberof module:authRoutes
//  * @inner
//  * @param {Object} req - The HTTP request object.
//  * @param {Object} res - The HTTP response object.
//  */
// router.post('/logout-user', logoutUser);


// module.exports = router;
