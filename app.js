let cookieParser = require('cookie-parser');
let compress = require('compression');
let express = require('express');
let logger = require('morgan');
let path = require('path');
let fs = require("fs");
let app = express();

// List of Projects
let projects = require("./src/data.json").projects;

// Compress/GZIP Server
app.use(compress());
app.use(express.static(path.join(__dirname, 'public'), { maxAge: '2592000' }));
app.use(express.static(path.join(__dirname, 'src'), { maxAge: '2592000' }));

// view engine setup
app.engine("html", function (filePath, options, callback) {
    fs.readFile(filePath, function (err, content) {
        if (err) return callback(err);
        return callback(null, content.toString());
    });
});
app.set('views', path.join(__dirname, './public'));
app.set('view engine', 'html');
// app.set('view cache', true);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.get('/', function(req, res, next) {
    res.render('index');
});

app.get('/about-me', function(req, res, next) {
    res.render('about-me');
});

app.get('/projects', function(req, res, next) {
    res.render('projects');
});

app.get('/project', function(req, res, next) {
    res.render('project');
});

projects.forEach((v, i) => {
    app.get(`/project/${i}`, function(req, res, next) {
        res.render('project');
    });
});

app.get('/contact', function(req, res, next) {
    res.render('contact');
});

module.exports = app;
