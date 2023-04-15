const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');
require('dotenv').config();

mongoose.connect(process.env.dbConnection, {
    useNewUrlParser: true,
    //useCreateIndex: true,
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

    for(let i = 0; i < 50; i++){
        const random1000 = Math.floor(Math.random() * 1000)
        await new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            price: `${Math.floor(Math.random() * 20 ) + 10}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid, tenetur, saepe sunt quaerat totam illum commodi praesentium porro iure eligendi officia, temporibus hic iusto! Non nostrum quo expedita laborum nobis.',
            image: 'https://source.unsplash.com/collection/483251'
        }).save();
    }
}

seedDB().then(() => {
    db.close();
})