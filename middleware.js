const ExpressError = require('./utils/ExpressError');
const { campgroundSchema, reviewSchema } = require('./schemas');
const { Campground, Review } = require('./models');

module.exports.isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()){
        next();
    } else {
        req.session.returnURL = req.originalUrl;
        req.flash('error', 'please login first');
        res.redirect('/login');
    }
}
module.exports.saveReturnURL = (req, res, next) => {
    if(req.session.returnURL) {
        res.locals.returnURL = req.session.returnURL;
    }
    next();
}
module.exports.validateCampground = (req, res, next) => {
    const result = campgroundSchema.validate(req.body);
    const {error} = result;
    if (error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    next();
}
module.exports.isAuthor = async (req, res, next) => {
    try {
        const { id } = req.params;
        const campground = await Campground.findById(id);
        if(!campground.author.equals(req.user._id)){
            req.flash('error', 'You are not authorized to do that!');
            return res.redirect(`/campgrounds/${id}`);
        }
        next();
    } catch(e) {
        next(e);
    }
}
module.exports.validateReview = (req, res, next) => {
    const result = reviewSchema.validate(req.body);
    const {error} = result;
    if (error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    next();
}
module.exports.isReviewAuthor = async (req, res, next) => {
    try {
        const { id, reviewId } = req.params;
        const review = await Review.findById(reviewId);
        if(!review.author.equals(req.user._id)){
            req.flash('error', 'You are not authorized to do that!');
            return res.redirect(`/campgrounds/${id}`);
        }
        next();
    } catch(e) {
        next(e);
    }
}