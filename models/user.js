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

    graphData:[
        {date:String, time:String}
        ],

    currentUserStats:[

        {dataValue: String, title: String},

        {dataValue: String, title: String},

        {dataValue: String, title: String},

        {dataValue: String, title: String}
    ],

    averageStats:[
        {
            weekAvg: String,
            value: String
        },
        {
            monthAvg: String,
            value: String
        },
        {
            sessionAvg: String,
            value: String

        },
        {
            streakAvg: String,
            value: String
        },

    ],

    chartStats:[],

    recordStats:[
        {
            totalTime: String,
            value: String
        },
        {
            totalSessions: String,
            value: Number
        },
        {
            longestStreak: String,
            value: String
        },
        {
            longestSession: String,
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

