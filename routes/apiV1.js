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
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
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
    obj["averageStats.2.sessionAvg"] = millisToMinutesAndSeconds(avgSession);
    obj["averageStats.2.value"] = millisToMinutesAndSeconds(avgSession);
    console.log(obj, 'obj log')

    User.findOneAndUpdate({"calmStatsId": doc.calmStatsId},
        {$set :obj},
        {new: true},
        function(err, doc){
          console.log('after avgSession time set in user model')
        }

    )

}

//calculates total time of all sessions and total sessions
function totalTime(doc) {
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
    const obj = {};
    obj["recordStats.0.totalTime"] = totalTime;
    obj["recordStats.0.value"] = totalTime;
    obj["recordStats.1.totalSessions"] = sessionLengths.length;
    User.findOneAndUpdate({"calmStatsId": doc.calmStatsId},
        {$set :obj},
        {new: true},
        function(err, doc){
            console.log('after avgSession time set in user model')
        }

    )
}

//sets total sessions for user
function totalSessions(doc) {
    const obj = {};

    obj["recordStats.1.value"] = doc.sessions.length;
    User.findOneAndUpdate({"calmStatsId": doc.calmStatsId},
        {$set :obj},
        {new: true},
        function(err, doc){
            console.log('total sessions set in user model')
        }

    )
}
//sets current streak if last session is from yesterdays date
function currentStreak(doc) {
    const lastSessionPosition = doc.sessions.length - 2;
    const currentSessionPosition = doc.sessions.length - 1;

    //const dateLast = moment(doc.sessions[lastSessionPosition].stopTime, 'x').format('DDDD');

    // remove .add after testing
    const dateCurrent = moment(doc.sessions[currentSessionPosition].stopTime, 'x').add(1, 'd').format('DDDD');

    // adds one day to the last day and compares to current day
    const dateCompare = moment(doc.sessions[lastSessionPosition].stopTime, 'x').add(3, 'd').format('DDDD');
    // if its equal to current day increment streak counter
    if(dateCurrent === dateCompare){
        //console.log(dateLast, dateCurrent,dateCompare,'increment by 1');
        User.findOneAndUpdate({"calmStatsId": doc.calmStatsId, "runningSession": false},
            { $inc: {"currentStats.3.value": 1}},
            {new: true},
            function(err, doc){
                console.log('incremented currentStreak by 1', doc.currentStats[3].value)
            }
        );
    }
    // if the streak is at 0 already
    else if(doc.currentStats[3].value === 0){
        console.log('already 0')
    }
    // not equal means the streak is over so the streak length is added to array
    // and the counter is reset to 0
    else{
        const streak = doc.currentStats[3].value;

        User.findOneAndUpdate({"calmStatsId": doc.calmStatsId},
            {$push: {"streaks": {"days":streak} }},
            {new: true},
            function (err, doc) {
            console.log(doc, 'streaks updated');
                zeroStreak(doc)
            }

        );
        console.log('updated streaks');
    }




    // User.findOneAndUpdate({"calmStatsId": doc.calmStatsId},
    //     {$inc :{"currentStats.3.value": 1}},
    //     {new: true},
    //     function(err, doc){
    //         console.log(doc, 'current streak set in user model')
    //     }
    //
    // )
}


//zeros out the streak counter
function zeroStreak(doc) {
    User.findOneAndUpdate({"calmStatsId": doc.calmStatsId},
        {$set: {"currentStats.3.value":0}},
        {new: true},
        function (err, doc) {
            console.log(err,doc, 'set streak to 0')
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
                    console.log(data, 'data log');
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
            //console.log(obj);
            //console.log(lastPosition);
            User.findOneAndUpdate({"calmStatsId": req.params.token, "runningSession": true},
                {$set :obj, "runningSession": false},
                {new: true},
                function(err, doc){
                    const avgSession = {stat:averageSessionLength(doc)};
                    // console.log(avgSession, 'average session time length');

                // totalTime(doc);
                // totalSessions(doc);
                // currentStreak(doc);


                }

            )

        }

    )




    //console.log(res.body, 'router.get response');


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
                console.log(data, 'data log');
                if(data === null) {
                    const newUser = new User({ calmStatsId: auth0Sub.sub, runningSession: false});
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