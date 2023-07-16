const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const campgrounds = require('../controllers/campgrounds');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');

router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(validateCampground, isLoggedIn, catchAsync(campgrounds.postNew));
router.get('/new', isLoggedIn, campgrounds.renderNewForm);
router.route('/:id')
    .get(catchAsync(campgrounds.show))
    .put(validateCampground, isLoggedIn, isAuthor, catchAsync(campgrounds.putEdit))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.delete));
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

module.exports = router;