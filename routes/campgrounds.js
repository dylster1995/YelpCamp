const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const { Campground, Review } = require('../models');
const { campgroundSchema, reviewSchema } = require('../schemas');

const validateCampground = (req, res, next) => {
    const result = campgroundSchema.validate(req.body);
    const {error} = result;
    if (error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    next();
}
const validateReview = (req, res, next) => {
    const result = reviewSchema.validate(req.body);
    const {error} = result;
    if (error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    next();
}

router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});

    res.render('index', { campgrounds });
}));
router.get('/new', (req, res) => {
    res.render('campgrounds/new');
});
router.get('/:id', catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate('reviews');

    res.render('campgrounds/show', { campground });
}));
router.get('/:id/edit', catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);

    res.render('campgrounds/edit', { campground });
}));
router.post('/', validateCampground, catchAsync(async (req, res, next) => {
    
    const { title, price, description, location, image } = req.body.campground;
    const campground = await Campground.create({ title, description, price, location, image });
    
    req.flash('success', 'Successfully made a new campground');
    res.redirect(`/campgrounds/${campground.id}`);
}));
router.put('/:id', validateCampground, catchAsync(async (req, res, next) => {
        const { title, price, description, location, image } = req.body.campground;
        const { id } = req.params;

        const campgrounds = await Campground.findByIdAndUpdate( id , { title, description, price, location, image });
        console.log(campgrounds);

        res.redirect(`/campgrounds/${id}`);
}));
router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete( id );

    res.redirect(`/campgrounds`);
}));
// router.post('/:id/reviews', validateReview, catchAsync(async(req,res) => {
//     const campground = await Campground.findById(req.params.id);
//     const review = new Review(req.body.review);

//     campground.reviews.push(review);

//     await review.save();
//     await campground.save();

//     res.redirect(`/campgrounds/${campground.id}`);
// }))
// router.delete('/:id/reviews/:reviewId', catchAsync(async (req, res) => {
//     const { id, reviewId } = req.params;
//     await Campground.findByIdAndUpdate( id, { $pull: { reviews: reviewId }});
//     await Review.findByIdAndDelete(reviewId);

//     res.redirect(`/campgrounds/${id}`);
// }))

module.exports = router;