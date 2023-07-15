module.exports.isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()){
        next();
    } else {
        req.flash('error', 'please login first');
        res.redirect('/login');
    }
}