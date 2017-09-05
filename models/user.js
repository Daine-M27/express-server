var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    firstName: String,
    lastName: String,
    emailAddress: String
});

var User = mongoose.model('User', userSchema);

// console.log(User)
module.exports = User;