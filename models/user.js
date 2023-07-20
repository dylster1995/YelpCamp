const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});

// this gives UserSchema a username and password field
UserSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', UserSchema)

module.exports = User;