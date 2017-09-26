const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const User = require('./models/user.js');
const index = require('./routes/index');
const users = require('./routes/users');
const apiV1 = require('./routes/apiV1');
const morgan = require('morgan');
const Promise = require('es6-promise').Promise;
// let server;
const app = express();



const mongoose = require('mongoose');

// if(process.env == 'production'){
//     mongoose.connect("mongodb://calmstatsdbu:OmegaRED27#@ds147044.mlab.com:47044/calm-stats-database")
// }
// else{
//     mongoose.connect('mongodb://localhost/calmStatsData');

mongoose.connect("mongodb://calmstatsdbu:OmegaRED27#@ds147044.mlab.com:47044/calm-stats-database");
}
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("we're connected!")
});


// CORS setup
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/api/v1', apiV1);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


var server;


function runServer(){
    const port = process.env.PORT || 3001;
    return new Promise ((resolve, reject) => {
        server = app.listen(port, () => {
            console.log('Your app is listening on port ${port}');
            resolve(server);
        })
            .on('error', err => {
                reject(err)
            })
    })
}

function closeServer() {
    return new Promise ((resolve, reject) => {
        console.log('Closing server');
        server.close(err => {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        })
    })
}

if (require.main === module) {
    runServer().catch(err => console.error(err));
};

//module.exports = app;

module.exports = {app, runServer, closeServer};
