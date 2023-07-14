const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const { Campground } = require('../models');
const { campgroundSchema } = require('../schemas');
const mongoose = require('mongoose');

const validateCampground = (req, res, next) => {
    const result = campgroundSchema.validate(req.body);
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
    try{
        const id = new mongoose.Types.ObjectId(req.params);
        const campground = await Campground.findById(id).populate('reviews');

        if(!campground){
            req.flash('error', 'Cannot find that campground!');
            res.redirect('/campgrounds');
        }
        res.render('campgrounds/show', { campground });
    } catch (e) {
        req.flash('error', 'Cannot find that campground!');
        res.redirect('/campgrounds');
    }
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

    req.flash('success', 'Successfully updated campground')
    res.redirect(`/campgrounds/${id}`);
}));
router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete( id );

    req.flash('success', 'Successfully deleted campground');
    res.redirect(`/campgrounds`);
}));

module.exports = router;