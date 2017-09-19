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
            sessionsWeek: String,
            value: Number
        },
        {
            sessionsMonth: String,
            value: Number
        },
        {
            sessionsYear: String,
            value: Number
        },
        {
            currentStreak: String,
            value: Number
        }
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