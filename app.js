const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground');
const methodOverride = require('method-override');
const morgan = require('morgan');
const ejsMate = require('ejs-mate');
require('dotenv').config();

mongoose.connect(process.env.dbConnection, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db =  mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected');
});

app.engine('ejs', ejsMate)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(morgan('tiny'));

app.get('/', (req, res) => {
    res.render('landingpage');
});
app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({});

    res.render('index', { campgrounds });
});
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
});
app.get('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const campgrounds = await Campground.findById(id);

    res.render('campgrounds/show', { campgrounds });
});
app.get('/campgrounds/:id/edit', async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);

    res.render('campgrounds/edit', { campground });
});
app.post('/campgrounds', async (req, res) => {
    const { title, price, description, location, image } = req.body;
    const campgrounds = await Campground.create({ title, description, price, location, image });

    res.redirect(`campgrounds/${campgrounds.id}`);
});
app.put('/campgrounds/:id', async (req, res) => {
    const { title, price, description, location, image } = req.body;
    const { id } = req.params;

    const campgrounds = await Campground.findByIdAndUpdate( id , { title, description, price, location, image });

    res.redirect(`/campgrounds/${id}`);
});
app.delete('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;

    const campgrounds = await Campground.findByIdAndDelete( id );

    res.redirect(`/campgrounds`);
});

app.listen(3000, () => {
    console.log('yelpcamp listening on port 3000');
});