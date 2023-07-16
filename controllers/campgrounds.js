const { Campground } = require('../models');
const mongoose = require('mongoose');

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});

    res.render('index', { campgrounds });
}
module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
}
module.exports.show = async (req, res, next) => {
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
}
module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);

    res.render('campgrounds/edit', { campground });
}
module.exports.postNew = async (req, res, next) => {
    const { title, price, description, location, image } = req.body.campground;
    const author = req.user._id;

    const campground = await Campground.create({ title, description, price, location, image, author });
    
    req.flash('success', 'Successfully made a new campground');
    res.redirect(`/campgrounds/${campground.id}`);
}
module.exports.putEdit = async (req, res, next) => {
    const { title, price, description, location, image } = req.body.campground;
    const { id } = req.params;

    const campgrounds = await Campground.findByIdAndUpdate( id , { title, description, price, location, image });

    req.flash('success', 'Successfully updated campground')
    res.redirect(`/campgrounds/${id}`);
}
module.exports.delete = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete( id );

    req.flash('success', 'Successfully deleted campground');
    res.redirect(`/campgrounds`);
}