require('dotenv').config();
const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db =  mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected');
});

const sample = (array) => array[Math.floor(Math.random() * array.length)]

const seedDB = async () => {
    await Campground.deleteMany({});
     

    for(let i = 0; i < 300; i++){
        const random1000 = Math.floor(Math.random() * 1000);
        const loc = cities[random1000];
        await new Campground({
            author: '64b1a6f1bc6e39661954cb50',
            location: `${loc.city}, ${loc.state}`,
            geometry: {
                type: "Point",
                coordinates: [loc.longitude, loc.latitude]
            },
            title: `${sample(descriptors)} ${sample(places)}`,
            price: `${Math.floor(Math.random() * 20 ) + 10}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid, tenetur, saepe sunt quaerat totam illum commodi praesentium porro iure eligendi officia, temporibus hic iusto! Non nostrum quo expedita laborum nobis.',
            images: [
                {
                    url: 'https://source.unsplash.com/collection/483251',
                    filename: "YelpCamp/qnjc8nartsqu4jvroviu"
                },
                {
                    url: 'https://source.unsplash.com/collection/483251',
                    filename: "YelpCamp/qnjc8nartsqu4jvroviu"
                }
            ]
        }).save();
    }
}

seedDB().then(() => {
    db.close();
})