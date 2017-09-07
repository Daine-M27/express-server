const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    firstName: String,
    lastName: String,
    emailAddress: String
});

const User = mongoose.model('User', userSchema);

// console.log(User)
module.exports = User;