let debug = require('debug')('okikio:server');
let cookieParser = require('cookie-parser');
let template = require('lodash.template');
let compress = require('compression');
let express = require('express');
let logger = require('morgan');
let helmet = require('helmet');
let http = require('http');
let path = require('path');
let fs = require("fs");
let app = express();
let server, port;

// Config File
let config = require("./src/config");

// For faster more efficient page switching
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

// A quick function for webpage get requests
let render = (page = "index", data) => {
    return (req, res, next) => {
        res.render(page, { barba: req.header("x-barba"), data: data });
    };
};

// Normalize a port into a number, string, or false.
let normalizePort = val => {
    let port = parseInt(val, 10);
    if (isNaN(port)) { return val; } // Named pipe
    if (port >= 0) { return port; } // Port number
    return false;
};

// Get port from environment and store in Express.
port = normalizePort(process.env.PORT || '3000');

// Protect server
app.use(helmet());

// Compress/GZIP Server
app.use(compress());
app.use(express.static(path.join(__dirname, 'public'), { maxAge: '2592000' }));

// view engine setup
app.engine("html", function(filePath, opts, callback) {
    let barba = opts.barba, data = opts.data, val, dom;
    fs.readFile(filePath, function(err, content) {
        if (err) return callback(err);
        val = content.toString();
        dom = new JSDOM(val).window.document;
        
        if (data) {
            let tempDOM;
            val = template(dom.querySelector('[render]').outerHTML, { 
                interpolate: /\%\=(.+?)\%/g
            }) (data);
            tempDOM = new JSDOM(val).window.document.documentElement;
            dom.querySelector('[render]').replaceWith(tempDOM);
            val = dom.documentElement.outerHTML;
        }
        
        if (barba) {
            dom = dom.querySelector('[data-barba="container"]');
            val = dom.outerHTML;
        }
        
        return callback(null, val);
    });
});

app.set('views', path.join(__dirname, './public'));
app.set('view engine', 'html');
app.set('view cache', true);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Routes and the pages to render
app.get('/', render());
app.get('/about', render("about"));
app.get('/contact', render("contact"));
app.get('/project', render("project"));
app.get('/project-list', render("project-list"));

config.projects.forEach((project, num) => {
    let length = config.projects.length;
    let prevNum = (num - 1) < 0 ? (length - 1) : num - 1;
    let nextNum = (num + 1) > (length - 1) ? 0 : num + 1;
    app.get(`/project/${num}`, render("project", {
        nextNum: nextNum, prevNum: prevNum,
        next: config.projects[nextNum],
        prev: config.projects[prevNum],
        ...project
    }));
});

// Set port
app.set('port', port);

// Create HTTP server.
server = http.createServer(app);

// Listen on provided port, on all network interfaces.
server.listen(port);

// Event listener for HTTP server "error" event.
server.on('error', err => {
    if (err.syscall !== 'listen') { throw err; }
    let bind = typeof port === 'string' ?
        'Pipe ' + port : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (err.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw err;
    }
});

// Event listener for HTTP server "listening" event.
server.on('listening', () => {
    let addr = server.address();
    let bind = typeof addr === 'string' ?
        'pipe ' + addr :
        'port ' + addr.port;
    debug('Listening on ' + bind);
});
