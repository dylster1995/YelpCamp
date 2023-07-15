const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { Campground } = require('../models');
const mongoose = require('mongoose');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');


router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});

    res.render('index', { campgrounds });
}));
router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
});
router.get('/:id', catchAsync(async (req, res, next) => {
    try{
        const id = new mongoose.Types.ObjectId(req.params);
        const campground = await Campground.findById(id).populate({
            path: 'reviews',
            populate: {
                path:'author'
            }
            }).populate('author');

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
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);

    res.render('campgrounds/edit', { campground });
}));
router.post('/', validateCampground, isLoggedIn, catchAsync(async (req, res, next) => {
    const { title, price, description, location, image } = req.body.campground;
    const author = req.user._id;

    const campground = await Campground.create({ title, description, price, location, image, author });
    
    req.flash('success', 'Successfully made a new campground');
    res.redirect(`/campgrounds/${campground.id}`);
}));
router.put('/:id', validateCampground, isLoggedIn, isAuthor, catchAsync(async (req, res, next) => {
    const { title, price, description, location, image } = req.body.campground;
    const { id } = req.params;

    const campgrounds = await Campground.findByIdAndUpdate( id , { title, description, price, location, image });

    req.flash('success', 'Successfully updated campground')
    res.redirect(`/campgrounds/${id}`);
}));
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete( id );

    req.flash('success', 'Successfully deleted campground');
    res.redirect(`/campgrounds`);
}));

module.exports = router;