const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const request = require('request');
const moment = require('moment');

//youtube api data
const GoogleApi_URL = 'https://www.googleapis.com/youtube/v3/search';
const ApiKey = 'AIzaSyDuLlKSYLeDn53_eJqd2GtWOMmuTAMD0uw';






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
     const date =  moment(req.params.time, "x").format('MMMM Do YYYY');
     console.log(date, 'date', req.params.token, 'token id');
    //User.findByIdAndUpdate()

            // loop through body to get additional info
            //console.log(bodyText);
            //
            //console.log(bodyText.items[2].id.videoId)
});





// pause session
router.get('/sessions/pause/:time');




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
                    const newUser = new User({ calmStatsId: auth0Sub.sub});
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