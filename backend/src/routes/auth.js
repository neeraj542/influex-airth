const express = require('express');
const { login, redirect } = require('../controllers/authController');

const router = express.Router();

router.get('/login', login);
router.get('/redirect', redirect);

module.exports = router;
