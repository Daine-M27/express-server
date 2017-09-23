const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const request = require('request');
const moment = require('moment');

//youtube api data
const GoogleApi_URL = 'https://www.googleapis.com/youtube/v3/search';
const ApiKey = 'AIzaSyDuLlKSYLeDn53_eJqd2GtWOMmuTAMD0uw';


//converts milliseconds to mins and secs
function millisToMinutesAndSeconds(millis) {
    const minutes = Math.floor(millis / 60000);
    const seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + " min " + (seconds < 10 ? '0' : '') + seconds + " s";
}

function millisToMinutes(millis){
    const minutes = Math.round((millis * 100) /100) / 60000;
    return minutes;
}


//sets current streak if last session is from yesterdays date
function currentStreak(doc) {
    let lastSessionPosition = null;
    let currentSessionPosition = null;

    if(doc.sessions.length === 0 ) {
        lastSessionPosition = doc.sessions.length ;
        currentSessionPosition = doc.sessions.length;
    }
    else if(doc.sessions.length === 1){
         lastSessionPosition = doc.sessions.length - 1;
         currentSessionPosition = doc.sessions.length - 1;
    }
    else{
         lastSessionPosition = doc.sessions.length - 2;
         currentSessionPosition = doc.sessions.length - 1;
    }


    // remove .add after testing  include to advance a day for each test .add(1, 'd')
    const dateCurrent = moment(doc.sessions[currentSessionPosition].stopTime, 'x').format('DDDD');

    // adds one day to the last day and compares to current day
    const dateCompare = moment(doc.sessions[lastSessionPosition].stopTime, 'x').add('d',1).format('DDDD');
    // if its equal to current day increment streak counter
    if(dateCurrent === dateCompare){
        const streak = parseInt(doc.currentUserStats[0].dataValue) + 1;
        //console.log(streak, 'streak')
        User.findOneAndUpdate({"calmStatsId": doc.calmStatsId, "runningSession": false},
            { $set: {"currentUserStats.0.dataValue": streak, "currentUserStats.0.title":"Current Daily Streak"}},

            {new: true},

            function(err, doc){
                console.log('incremented currentStreak by 1');
                averageSessionLength(doc)

            }
        );
    }
    // else if(dateCurrent ){
    //     zeroStreak(doc);
    //     // User.findOneAndUpdate({"calmStatsId": doc.calmStatsId},
    //     //     {$set: {"currentUserStats.0.value": 0 }},
    //     //     {new: true},
    //     //     function (err, doc) {
    //     //         console.log(doc, 'streaks updated');
    //     //     }
    //     //
    //     // );
    // }
    // // if the streak is at 0 already
    // else if(doc.currentUserStats[0].value === 0){
    //     console.log('already 0')
    // }
    // not equal means the streak is over so the streak length is added to array
    // and the counter is reset to 0
    else{
        // const streak = doc.currentUserStats[0].value;
        //
        // User.findOneAndUpdate({"calmStatsId": doc.calmStatsId},
        //     {$push: {"streaks": {"days":streak} }},
        //     {new: true},
        //     function (err, doc) {
        //     console.log(doc, 'streaks updated');
        //         zeroStreak(doc)
        //     }
        //
        // );
        zeroStreak(doc);
        console.log('zero streak');
    }

}

//sets total sessions for user
function totalSessions(doc) {
    const obj = {};

    obj["currentUserStats.1.dataValue"] = doc.sessions.length;
    User.findOneAndUpdate({"calmStatsId": doc.calmStatsId},
        {$set :obj, "currentUserStats.1.title":"Total Sessions"},
        {new: true},
        function(err, doc){
            console.log(doc, 'total sessions set in user model')
            totalTime(doc);
        }

    )
}

//calculates total time of all sessions and total sessions
function totalTime(doc) {
    console.log(doc, 'input doc');
    let sessionLengths = [];
    for (i = 0; i < doc.sessions.length; i++ ){
        sessionLengths.push((doc.sessions[i].stopTime) - (doc.sessions[i].startTime));
    }
    //console.log(sessionLengths, 'session lengths');
    let total = 0;
    for (i = 0; i < sessionLengths.length; i++){
        total += sessionLengths[i];
    }
    const totalTime = millisToMinutesAndSeconds(total);
    console.log(totalTime, 'total time in mins and secs');
    User.findOneAndUpdate({"calmStatsId": doc.calmStatsId},
        {$set :{'currentUserStats.2.dataValue': totalTime,
        'currentUserStats.2.title':'Total Meditation Time' }},
        {new: true},
        function(err, doc){
            console.log(err, totalTime, 'total time set');
            currentStreak(doc);
        }

    )
}


//calculates and sets average session statistic
function averageSessionLength(doc) {
    let sessionLengths = [];
    for (i = 0; i < doc.sessions.length; i++ ){
        sessionLengths.push((doc.sessions[i].stopTime) - (doc.sessions[i].startTime));
    }

    let total = 0;
    for (i = 0; i < sessionLengths.length; i++){
        total += sessionLengths[i];
    }
    const avgSession = Math.round(total / sessionLengths.length);
    console.log(avgSession, 'avg Session function log');
    const obj = {};
    obj["currentUserStats.3.dataValue"] = millisToMinutesAndSeconds(avgSession);
    //console.log(obj, 'obj log')
    console.log(obj);
    User.findOneAndUpdate({"calmStatsId": doc.calmStatsId},
        {$set :obj, "currentUserStats.3.title":"Average Session Length"},
        {new: true},
        function(err, doc){
        graphData(doc);
            console.log(err, doc, 'after avgSession time set in user model')
        }
    )

}

function graphData(doc) {
    function dateCalc(inputData) {
       return moment(inputData, 'x').format("MMM D");
    }
    let graphData = [];
    let dates = [];
    let sessionLengths = [];
    let sessionLengthsMins = [];
    for (i = 0; i < doc.sessions.length; i++ ){
        sessionLengths.push((doc.sessions[i].stopTime) - (doc.sessions[i].startTime));
    }
    for (i = 0; i < sessionLengths.length; i++){
        sessionLengthsMins.push(millisToMinutes(sessionLengths[i]))
    }
    for (i = 0; i < sessionLengths.length; i++){
        dates.push(dateCalc(doc.sessions[i].startTime));
    }
    for (i = 0; i < dates.length; i++){
        const jsonDate = {date:dates[i], time:sessionLengthsMins[i]};
        graphData.push(jsonDate);
    }
    User.findOneAndUpdate({"calmStatsId": doc.calmStatsId},
        {$set :{"graphData":graphData}},
        {new: true},
        function(err, doc){
            console.log(err, 'graphData')
        }
    )
}

//zeros out the streak counter
function zeroStreak(doc) {
    User.findOneAndUpdate({"calmStatsId": doc.calmStatsId},
        {$set: {"currentUserStats.0.dataValue":0, "currentUserStats.0.title":"Current Daily Streak"}},
        {new: true},
        function (err, doc) {
            console.log('set streak to 0');
            averageSessionLength(doc);
        }
    )
}




// search youtube for keywords
router.get('/search/:searchTerm', function(req, res, next) {
    //console.log(req.params);
    const searchTerm = req.params.searchTerm;
    const requestURL =  GoogleApi_URL + '?'
       + 'part=snippet&key='
       + ApiKey
       + '&maxResults=30&type=video&videoDuration=long&q='
       + searchTerm;

    request(requestURL, function (error, response, body) {
        if (error) {
            res.send(500);
        }
        else {
            let bodyText = JSON.parse(body);
            // loop through body to get additional info
            //console.log(bodyText);
            res.send(bodyText);
            //console.log(bodyText.items[2].id.videoId)
        }
    });
});

//returns all user stats from database

router.get('/sessions/getstats/:token', function(req, res, next) {
    console.log(req.params.token, 'getstats token get stats');
if(req.params.token){

    const accessToken = req.params.token;
    const options = {
        url: 'https://calm-stats-test.auth0.com/userinfo',
        headers: {
            'Authorization': 'Bearer '+ accessToken
        }
    };


    request(options, function (error, response, body) {
        if (error) {
            res.send(500);
        }
        else {
            console.log(body, 'else body');
            if(body != 'Unauthorized'){

                const auth0Sub = JSON.parse(body);
                console.log(auth0Sub.sub, ' body.sub');
                User.findOne({ calmStatsId: auth0Sub.sub}, function(err, data){
                    //console.log(data, 'data log');
                    if(!data) {

                        res.send({});

                    }
                    else if(data){
                        //send back data to react state to update
                        console.log('user already exists')
                        // calmStatsUserId = uniqueId;
                        // userIdCallback(uniqueId);
                        res.send(data)
                    }
                    else{
                        console.log(err)
                    }
                })
            }


        }
    });
}

});


router.get('/sessions/update-stats/:token', function (req, res, next) {

    const token = req.params.token;
    User.findOne({ calmStatsId: token}, function(err, data){
        //console.log(data, 'data log');
        if(!data) {

            res.send({});

        }
        else if(data){
            //sends back data to update state on client
            res.send(data)
        }
        else{
            console.log(err)
        }
    })
})

// create session from play button on client

router.get('/sessions/start/:time/:token', function(req, res, next) {
     //console.log(req.params.time, 'time from client in milliseconds from 1/1/1970');

     const date =  moment(req.params.time, "x");
     console.log(date, 'date', req.params.token, 'token id');



     User.findOneAndUpdate({"calmStatsId": req.params.token, "runningSession": false},
         { $push: {"sessions": {"startTime":date} },
         $set:{"runningSession":true}},
         {new: true},
         function(err, doc){
         //console.log('session start running set to True, Null means session is running')
     }
     );


     //console.log(res.body, 'router.get response');


});






router.get('/sessions/stop/:time/:token/', function(req, res, next) {
    //console.log(req.params.time, 'time from client in milliseconds from 1/1/1970');
    console.log('stopping session');
    const date =  moment(req.params.time, "x");

    User.findOne({"calmStatsId": req.params.token, "runningSession": true},
        function(err, doc){
            const obj = {};
            obj["sessions."+ (doc.sessions.length - 1) + ".stopTime"] = date;

            User.findOneAndUpdate({"calmStatsId": req.params.token, "runningSession": true},
                {$set :obj, "runningSession": false},
                {new: true},
                function(err, doc){
                totalSessions(doc);
                res.send(doc);
                }
            )


        }
    )
});


//get unique id from auth0 then create user unless user exists.
router.get('/users/:auth0id', function(req, res, next) {
    const accessToken = req.params.auth0id;
    console.log(accessToken, 'get auth0 access token');
    const options = {
        url: 'https://calm-stats-test.auth0.com/userinfo',
        headers: {
            'Authorization': 'Bearer '+ accessToken
        }
    };

    request(options, function (error, response, body) {
        if (error) {
            res.send(500);
        }
        else {
            const auth0Sub = JSON.parse(body);
            //console.log(auth0Sub.sub, ' body.sub');
            User.findOne({ calmStatsId: auth0Sub.sub}, function(err, data){
                //console.log(data, 'data log');
                if(data === null) {
                    const newUser = new User({
                        calmStatsId: auth0Sub.sub,
                        runningSession: false,
                        currentUserStats: new Array(
                            {"dataValue":0, "title":""},
                            {"dataValue":0, "title":""},
                            {"dataValue":'', "title":""},
                            {"dataValue":'', "title":""}
                            )});
                    newUser.save(function (err, newUser) {
                        if (err) {
                            console.log(err);
                            res.sendStatus(500)
                        }
                        else {
                            res.send(newUser);
                            console.log(newUser,'new user created');
                        }
                    });

                }
                else if(data !== null){
                    //send back data to react state to update
                     console.log('user already exists')
                    // calmStatsUserId = uniqueId;
                    // userIdCallback(uniqueId);
                    res.send(data)
                }
                else{
                    console.log(err)
                }
            })

        }
    });

});



//exports router
module.exports = router;