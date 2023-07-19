const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const campgrounds = require('../controllers/campgrounds');
const { isLoggedIn, isAuthor, validateCampground, addCloudinaryToCampground } = require('../middleware');
const { storage } = require('../cloudinary');
const upload = require('multer')({ storage });

router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn,
        upload.array('images'),
        addCloudinaryToCampground,
        validateCampground, 
        catchAsync(campgrounds.postNew));
router.get('/new', isLoggedIn, campgrounds.renderNewForm);
router.route('/:id')
    .get(catchAsync(campgrounds.show))
    .put(isLoggedIn,
        isAuthor,
        upload.array('images'),
        addCloudinaryToCampground,
        validateCampground,
        catchAsync(campgrounds.putEdit))
    .delete(isLoggedIn,
        isAuthor,
        catchAsync(campgrounds.delete));
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

module.exports = router;