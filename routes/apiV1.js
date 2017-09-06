var express = require('express');
var router = express.Router();
var User = require('../models/user.js');
var request = require('request');

//youtube api data
var GoogleApi_URL = 'https://www.googleapis.com/youtube/v3/search';
var ApiKey = 'AIzaSyDuLlKSYLeDn53_eJqd2GtWOMmuTAMD0uw';






// search youtube for keywords
router.get('/search/:searchTerm', function(req, res, next) {
    var searchTerm = req.params.searchTerm;
   var requestURL =  GoogleApi_URL + '?'
       + 'part=snippet&key='
       + ApiKey
       + '&maxResults=3&type=video&videoDuration=long&q='
       + searchTerm;

        //     part: 'snippet',
        //     key: ApiKey,
        //     q: 'searchTerm',
        //     maxResults: 10,
        //     videoDuration: 'long'

    console.log(requestURL);

    request(requestURL, function (error, response, body) {
        if (error) {
            res.send(500);
        }
        else {
            var body = JSON.parse(body)
            res.send(body.items[2].id.videoId);
            console.log(body.items[2].id.videoId)
        }
    });
});

/* GET home page. */
router.get('/', function(req, res, next) {
    res.send(200);
});


//create user
router.post('/users', function(req, res, next) {

    var newUser = new User(req.body);
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