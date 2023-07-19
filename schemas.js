const Joi = require('joi-oid');

module.exports.campgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required().min(0).max(100),
        images: Joi.array().required(),
        description: Joi.string().required(),
        location: Joi.string(),
        geometry: Joi.object({
            type: Joi.string().required(),
            coordinates: Joi.array()
        }),
        author: Joi.objectId(),  
    }).required(),
    deleteImages: Joi.array()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required()
    }).required()
})
