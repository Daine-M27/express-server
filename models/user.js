const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    calmStatsId: String,
    runningSession: Boolean,
    sessions:[
        {
        startTime: String,
        stopTime: String,
        videoId: String
        }
    ],
    currentStats:[
        {
            title: String,
            value: Number
        },
        {
            title: String,
            value: Number
        },
        {
            title: String,
            value: Number
        },
        {
            title: String,
            value: Number
        }
    ],
    averageStats:[
        {
            title: String,
            value: String
        },
        {
            title: String,
            value: String
        },
        {
            title: String,
            value: String
        },
        {
            title: String,
            value: String
        },

    ],
    recordStats:[
        {
            title: String,
            value: String
        },
        {
            title: String,
            value: Number
        },
        {
            title: String,
            value: String
        },
        {
            title: String,
            value: String
        },

    ],

    streaks:[
        {
            days: Number
        }
    ],
    mostUsedVideo: [
        {
            videoId: String,
            count: Number
        }
    ],
    lastSession: String

});

const User = mongoose.model('User', userSchema);

// console.log(User)
module.exports = User;