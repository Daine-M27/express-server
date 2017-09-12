const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const request = require('request');
const moment = require('moment');

//youtube api data
const GoogleApi_URL = 'https://www.googleapis.com/youtube/v3/search';
const ApiKey = 'AIzaSyDuLlKSYLeDn53_eJqd2GtWOMmuTAMD0uw';
let calmStatsUserId = '';





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





// create session from play button on client
router.get('/sessions/start/:time', function(req, res, next) {
     //console.log(req.params.time, 'time from client in milliseconds from 1/1/1970');
     const date =  moment(req.params.time, "x");
     console.log(date);
    //User.findByIdAndUpdate()

});





// pause session
router.get('/sessions/pause/:time');




//create user
router.get('/users/:auth0id', function(req, res, next) {
    const accessToken = req.params.auth0id;
    const options = {
        url: 'https://calm-stats-test.auth0.com/userinfo',
        headers: {
            'Authorization': 'Bearer '+ accessToken
        }
    };

    function databaseUsers(uniqueId) {
        console.log(uniqueId, 'unique Id from callback()');

        User.findOne({ calmStatsId: uniqueId}, function(err, data){
            console.log(data, 'data log');
            if(data === null) {
                const newUser = new User({ calmStatsId: uniqueId});
                newUser.save(function (err, newUser) {
                    if (err) {
                        console.log(err);
                        res.sendStatus(500)
                    }
                    else {
                        console.log(newUser,'new user created')
                    }
                });

            }
            else if(data !== null){
                //send back data to react state to update
                console.log('user already exists')
                calmStatsUserId = uniqueId;
            }
            else{
                console.log(err)
            }
        })
    }


        //console.log(uniqueId, 'unique Id from callback()');
        // const newUser = new User(uniqueId);
        //
        // newUser.save(function (err, newUser) {
        //     if (err) {
        //         console.log(err);
        //         res.send(500)
        //     }
        //     else {
        //         res.send(newUser)
        //     }
        // }




    function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
            const info = JSON.parse(body);
            const userId = info.sub;
            databaseUsers(userId);

        }
        else {
            res.sendStatus(500)
        }
    }

    request(options, callback);



});



//exports router
module.exports = router;