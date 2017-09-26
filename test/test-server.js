const chai = require('chai');
const chaiHttp = require('chai-http');
const {app, runServer, closeServer} = require('../app');

const should = chai.should();

chai.use(chaiHttp);

describe('Server', function () {

    before(function () {
        return  runServer();
    });

    after(function () {
        return closeServer();
    });

    it('return user data', function(){
        return chai.request(app)
            .get('/api/v1/users/TrV49oMkmg7iO43J')
            .then(function(res){
                console.log(res);
                res.should.have.status(200);
                res.should.be.json;
            });
    });

    it('should return search results object', function () {
        return chai.request(app)
            .get('/api/v1/search/meditation')
            .then(function (res) {
                res.body.should.be.a('object');
                res.should.have.status(200)
            })
    });

    it('should return user stats', function () {
        return chai.request(app)
            .get('/api/v1/sessions/getstats/TrV49oMkmg7iO43J')
            .then(function (res) {
                res.should.have.status(200);
                res.should.be.json;
            })
    });

    it('start a session', function () {

        return chai.request(app)
            .get('/api/v1/sessions/start/1506126966545/google-oauth2|102106501839629042238')
            .then(function (res) {
                res.should.have.status(200);

            })
    });

    it('should return user stats', function () {

        return chai.request(app)
            .get('/api/v1/sessions/stop/1506127151839/google-oauth2|102106501839629042238')
            .then(function (res) {
                res.should.have.status(200);
                res.should.be.json;

            })
    });

});