const baseJoi = require('joi-oid');
const sanitizeHTML = require('sanitize-html');

const extension = (Joi) => ({
    type: 'string',
    base: Joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHTML(value, {
                    allowedTags: [],
                    allowedAttributes: []
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi = baseJoi.extend(extension);

module.exports.campgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().escapeHTML().required(),
        price: Joi.number().required().min(0).max(100),
        images: Joi.array().required(),
        description: Joi.string().escapeHTML().required(),
        location: Joi.string().escapeHTML(),
        geometry: Joi.object({
            type: Joi.string().escapeHTML().required(),
            coordinates: Joi.array()
        }),
        author: Joi.objectId(),  
    }).required(),
    deleteImages: Joi.array()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().escapeHTML().required()
    }).required()
})

