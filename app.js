var cookieParser = require('cookie-parser');
var compress = require('compression');
var express = require('express');
var logger = require('morgan');
var path = require('path');
var fs = require("fs");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// Compress/GZIP Server
app.use(compress());
app.use(express.static(path.join(__dirname, 'public'), { maxAge: '2592000' }));
app.use(express.static(path.join(__dirname, 'src'), { maxAge: '2592000' }));

// view engine setup
app.engine("html", function (filePath, options, callback) {
    fs.readFile(filePath, function (err, content) {
        if (err) return callback(err);
        return callback(null, content.toString())
    });
});
app.set('views', path.join(__dirname, './public'));
app.set('view engine', 'html');
// app.set('view cache', true);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.get('/', function(req, res, next) {
    res.render('index');
});

app.get('/about-me', function(req, res, next) {
    res.render('about-me');
});

module.exports = app;
