var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var compress = require('compression');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// Compress/GZIP Server
app.use(compress());
app.use(express.static(path.join(__dirname, 'public'), { maxAge: '2592000' }));
app.use(express.static(path.join(__dirname, 'src'), { maxAge: '2592000' }));


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.get('/', function(req, res, next) {
    res.sendFile('public/src/index.html');
});

app.get('/about-me', function(req, res, next) {
    res.sendFile('public/src/about-me.html');
});

module.exports = app;
