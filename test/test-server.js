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
            .get('/api/v1/users/g3jpa4HUJ20tekz7')
            .then(function(res){
                res.should.have.status(200);
                res.should.be.json;
            });
    });

    // it('start a user session', function () {
    //     return chia.request(app)
    //         .get('/api/v1/sessions/start')
    // })
});