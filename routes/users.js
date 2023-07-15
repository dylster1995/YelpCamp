const express = require('express');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const { isLoggedIn, saveReturnURL } = require('../middleware');

router.get('/register', (req, res) => {
    res.render('users/register');
})
router.post('/register', catchAsync(async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if(err){
                return next(err);
            }
            req.flash('success', 'Welcome to Yelp Camp!');
            res.redirect('/campgrounds');
        });
    } catch(e) {
        console.log(e)
        req.flash('error', e.message);
        res.redirect('register');
    }
}));
router.get('/login', (req, res) => {
    res.render('users/login');
})
router.post('/login', saveReturnURL, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), async (req, res) => {
    req.flash('success', `welcome back ${req.user.username}`);
    res.redirect(res.locals.returnURL || '/campgrounds');
});
router.get('/logout', isLoggedIn, (req, res, next) => {
    req.logout(function(err) {
        if(err){ 
            return next(err);
        }
        req.flash('success', 'logged out');
        res.redirect('/campgrounds');
    });
});

module.exports = router;
