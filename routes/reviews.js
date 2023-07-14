const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const { Campground, Review } = require('../models');
const { reviewSchema } = require('../schemas');

const validateReview = (req, res, next) => {
    const result = reviewSchema.validate(req.body);
    const {error} = result;
    if (error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    next();
}

router.post('/', validateReview, catchAsync(async(req,res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);

    console.log(campground);
    console.log(review)

    campground.reviews.push(review);

    await review.save();
    await campground.save();

    req.flash('success', 'Successfully created new review');
    res.redirect(`/campgrounds/${campground.id}`);
}))
router.delete('/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate( id, { $pull: { reviews: reviewId }});
    await Review.findByIdAndDelete(reviewId);

    req.flash('success', 'Successfully deleted review')
    res.redirect(`/campgrounds/${id}`);
}))

module.exports = router;