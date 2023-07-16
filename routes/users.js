const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const { isLoggedIn, saveReturnURL } = require('../middleware');
const users = require('../controllers/users');

router.route('/register')
    .get(users.renderRegister)
    .post(catchAsync(users.createUser));
router.route('/login')
    .get(users.renderLoginForm)
    .post(saveReturnURL, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login);

router.get('/logout', isLoggedIn, users.logout);

module.exports = router;
