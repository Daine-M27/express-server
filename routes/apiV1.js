const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const request = require('request');

//youtube api data
const GoogleApi_URL = 'https://www.googleapis.com/youtube/v3/search';
const ApiKey = 'AIzaSyDuLlKSYLeDn53_eJqd2GtWOMmuTAMD0uw';






// search youtube for keywords
router.get('/search/:searchTerm', function(req, res, next) {
    console.log(req.params);
    const searchTerm = req.params.searchTerm;
    const requestURL =  GoogleApi_URL + '?'
       + 'part=snippet&key='
       + ApiKey
       + '&maxResults=3&type=video&videoDuration=long&q='
       + searchTerm;

    console.log(requestURL);

    request(requestURL, function (error, response, body) {
        if (error) {
            res.send(500);
        }
        else {

            let bodyText = JSON.parse(body);
            console.log(bodyText);
            res.send(bodyText);
            console.log(bodyText.items[2].id.videoId)
        }
    });
});


/* GET home page. */
router.get('/', function(req, res, next) {
    res.send(200);
});


//create user
router.post('/users', function(req, res, next) {

    const newUser = new User(req.body);
    newUser.save(function (err, newUser) {
        if (err) {
            console.log(err);
            res.send(500)
        }
        else {
            res.send(newUser)
        }
    });
    console.log(req.body);

});



//exports router
module.exports = router;