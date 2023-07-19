const ExpressError = require('./utils/ExpressError');
const {  campgroundSchema, reviewSchema } = require('./schemas');
const { Campground, Review } = require('./models');
const mongoose = require('mongoose');

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
    const { error } = campgroundSchema.validate(req.body);
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
        return next(e);
    }
}
module.exports.validateReview = (req, res, next) => {
    const result = reviewSchema.validate(req.body);
    const {error} = result;
    if (error){
        const msg = error.details[0].message;
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
module.exports.addCloudinaryToCampground = async (req, res, next) => {
    try{
        const { campground } = req.body;
        const addImages = req.files.map(f => ({ url: f.path, filename: f.filename }));
        if(req.params.id){
            const { id } = req.params;
            const foundCampground = await Campground.findById(id);
            if(foundCampground){
                campground.images = []
                campground.images.push(...foundCampground.images);
                campground.images.push(...addImages);
            }
        }
         else {
            campground.images = addImages;
            campground.author = new mongoose.Types.ObjectId(req.user._id);
        }
        next();
    } catch(e) {
        next(e);
    }
}