const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
    res.render('users/register');
}
module.exports.createUser = async (req, res) => {
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
}
module.exports.renderLoginForm = (req, res) => {
    res.render('users/login');
}
module.exports.login = async (req, res) => {
    req.flash('success', `welcome back ${req.user.username}`);
    res.redirect(res.locals.returnURL || '/campgrounds');
}
module.exports.logout = (req, res, next) => {
    req.logout(function(err) {
        if(err){ 
            return next(err);
        }
        req.flash('success', 'logged out');
        res.redirect('/campgrounds');
    });
}