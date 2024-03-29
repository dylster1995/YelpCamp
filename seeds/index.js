require('dotenv').config()
const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const { Campground, User, Review } = require('../models');
const { names } = require('./names');

mongoose.connect(process.env.DB_CONNECTION, {
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
    await User.deleteMany({}); 
    await Review.deleteMany({});

    let ids = [];

    for(let j = 0; j < 30; j++) {
        if(names[j] == '') {
            continue;
        }
        const user = new User({ 
            email: `${names[j]}@gmail.com`, 
            username: `${names[j]}`
        });
        const registeredUser = await User.register(user, `${names[j]}`);

        ids.push(registeredUser._id);
    }

    for(let i = 0; i < 300; i++){
        const randomNum = max => Math.floor(Math.random() * max);
        const loc = cities[randomNum(1000)];
        await new Campground({
            author: ids[randomNum(ids.length)],
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
                    url: process.env.DEFAULT_CAMPGROUND_IMAGE_URL,
                    filename: process.env.DEFAULT_CAMPGROUND_IMAGE_FILENAME
                }
            ]
        }).save();
    }
}

seedDB().then(() => {
    db.close();
})