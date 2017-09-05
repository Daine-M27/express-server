var express = require('express');
var router = express.Router();
var User = require('../models/user.js');
var request = require('request');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.send(200);
});

router.get('/search', function(req, res, next) {
    request('http://www.google.com', function (error, response, body) {
        if (error) {
            res.send(500);
        }

        else {res.send(body)}
    });
});

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

module.exports = router;