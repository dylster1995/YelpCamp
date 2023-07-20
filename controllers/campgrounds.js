const { Campground } = require('../models');
const mongoose = require('mongoose');
const { cloudinary } = require('../cloudinary');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });


module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});

    res.render('index', { campgrounds });
}
module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
}
module.exports.show = async (req, res, next) => {
        const id = new mongoose.Types.ObjectId(req.params);
        const campground = await Campground.findById(id).populate({
            path: 'reviews',
            populate: {
                path:'author'
            }
            }).populate('author');

        if(!campground){
            req.flash('error', 'Cannot find that campground!');
            return res.redirect('/campgrounds');
        }
        res.render('campgrounds/show', { campground });
}
module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);

    res.render('campgrounds/edit', { campground });
}
// Post route to create a new campground
module.exports.postNew = async (req, res, next) => {
    // get geoJSON of the location and save it to the req.body.campground object
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    req.body.campground.geometry = geoData.body.features[0].geometry;
    const campground = new Campground(req.body.campground);

    await campground.save();
    
    req.flash('success', 'Successfully made a new campground');
    res.redirect(`/campgrounds/${campground.id}`);
}
module.exports.putEdit = async (req, res, next) => {
    // get geoJSON of the location and save it to the req.body.campground object
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    req.body.campground.geometry = geoData.body.features[0].geometry;
    const { title, price, description, location, images, geometry } = req.body.campground;
    req.body.campground.geometry = geoData.body.features[0].geometry;
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate( id , { title, description, price, location, images, geometry });
    const { deleteImages } = req.body;

    if(deleteImages){
        for(let filename of deleteImages) {
            // Delete images from cloudinary
            await cloudinary.uploader.destroy(filename);
        }
        // Delete images from mongodb
        await campground.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}})
    }

    req.flash('success', 'Successfully updated campground')
    res.redirect(`/campgrounds/${id}`);
}
module.exports.delete = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete( id );

    req.flash('success', 'Successfully deleted campground');
    res.redirect(`/campgrounds`);
}