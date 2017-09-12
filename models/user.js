const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    calmStatsId: String,
    sessions:[{
        dateTime: String,
        date: String,
        startTime: String,
        stopTime: String,
        pauseTime: Number,
        videoId: String
    }],
    statistics: {
        totalTime: String,
        dailyAvgTime: String,
        weeklyAvgTime: String,
        monthlyAvgTime: String,
        sessionAvgTime: String,
        totalSessions: Number,
        currentWeekSessions: Number,
        currentMonthSessions: Number,
        currentYearSessions: Number,
        currentStreak: Number,
        recordStreak: Number,
        streakAvg: Number,
        mostUsedVideo: [{
            videoId: String,
            count: Number
        }],
        lastSession: String,

    }

});

const User = mongoose.model('User', userSchema);

// console.log(User)
module.exports = User;