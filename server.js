let debug = require('debug')('okikio:server');
let cookieParser = require('cookie-parser');
let compress = require('compression');
let express = require('express');
let logger = require('morgan');
let helmet = require('helmet');
let http = require('http');
let path = require('path');
let app = express();
let server, port;

let { engine } = require("./render");

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
app.engine("html", engine);

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
app.get(`/project/:num`, (req, res, next) => {
    res.render(`project-${req.params.num}`, { barba: req.header("x-barba") });
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
