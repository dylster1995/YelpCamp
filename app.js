const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground');
const methodOverride = require('method-override');
const morgan = require('morgan');
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
require('dotenv').config();
const { campgroundSchema } = require('./schemas');
console.log(process.env.DB_CONNECTION)
mongoose.connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db =  mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected');
});

app.engine('ejs', ejsMate);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(morgan('tiny'));

const validateCampground = (req, res, next) => {

    const result = campgroundSchema.validate(req.body);
    const {error} = result;
    if (error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    next();
}

app.get('/', (req, res) => {
    res.render('landingpage');
});
app.get('/campgrounds', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});

    res.render('index', { campgrounds });
}));
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
});
app.get('/campgrounds/:id', catchAsync(async (req, res, next) => {
        const { id } = req.params;
        const campgrounds = await Campground.findById(id);

        res.render('campgrounds/show', { campgrounds });
}));
app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);

    res.render('campgrounds/edit', { campground });
}));
app.post('/campgrounds', validateCampground, catchAsync(async (req, res, next) => {
    // if(!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
    
    const { title, price, description, location, image } = req.body.campground;
    const campgrounds = await Campground.create({ title, description, price, location, image });

    res.redirect(`/campgrounds/${campgrounds.id}`);

}));
app.put('/campgrounds/:id', validateCampground, catchAsync(async (req, res, next) => {
        const { title, price, description, location, image } = req.body;
        const { id } = req.params;

        const campgrounds = await Campground.findByIdAndUpdate( id , { title, description, price, location, image });

        res.redirect(`/campgrounds/${id}`);
}));
app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params;

    const campgrounds = await Campground.findByIdAndDelete( id );

    res.redirect(`/campgrounds`);
}));
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if(!err.message) err.message = 'Oh No, Something Went Wrong!';
    res.status(statusCode).render('error', { err });
})

app.listen(3000, () => {
    console.log('yelpcamp listening on port 3000');
});