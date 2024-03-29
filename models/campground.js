const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');
const { cloudinary } = require('../cloudinary');

const ImageSchema = new Schema({
    url: String,
    filename: String
})

ImageSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload', '/upload/w_200');
})
ImageSchema.virtual('showPageImage').get(function() {
    return this.url.replace('/upload', '/upload/w_600,h_400');
})
ImageSchema.virtual('cardImage').get(function() {
    return this.url.replace('/upload', '/upload/w_500');
})

const CampgroundSchema = new Schema({
    title: String,
    images: [ImageSchema],
    price: Number,
    description: String,
    location: String,
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }],
    image: String
},
{
    timestamps: true,
    toJSON: { virtuals: true }
});

CampgroundSchema.virtual('properties.popUpMarkup').get(function() {
    return `<strong><a id="clusterMapPoint" href="/campgrounds/${this.id}">${this.title}</a></strong>`;
})

CampgroundSchema.post('findOneAndDelete', async function(doc) {
    if(doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
    for(let img of doc.images) {  
        console.log(img.filename);      
        await cloudinary.uploader.destroy(img.filename);
    }
});

const Campground = mongoose.model('Campground', CampgroundSchema);

module.exports = Campground;