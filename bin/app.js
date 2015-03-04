/* jshint node: true, strict: true */

"use strict";

var path                = require('path'),
    fs                  = require('fs'),
    http                = require('http'),
    config              = require('./config.js'),
    log                 = require('./log.js'),

    helmet              = require('helmet'),
    express             = require('express'),
    bodyParser          = require('body-parser'),
    expressValidator    = require('express-validator'),
    compress            = require('compression')(),
    serveStatic         = require('serve-static'),
    hbs                 = require('hbs'),

    app                 = express(),

    middleSSL           = require('./middleware/ssl.js'),
    routeCsp            = require('./routes/csp.js'),
    openmic             = require('./routes/openmic.js'),
    scholarship         = require('./routes/scholarship.js'),
    routeAssets         = require('./routes/assets.js');



// Max out the number of socket connections.
// Default concurrent sockets in node.js is 5. We need more!

http.globalAgent.maxSockets = Infinity;



// Read "fold css"

var css = fs.readFileSync(path.resolve(__dirname, '..' + config.get('docRoot') + '/css/structure.css'), {encoding:'utf8'});



// Configure application

app.disable('x-powered-by');
app.enable('trust proxy');



// Set middleware

app.use(middleSSL.ensure);
app.use(compress);
app.use(serveStatic(path.resolve(__dirname, '..' + config.get('docRoot'))));



// Set up template engine

hbs.registerPartials(path.resolve(__dirname, '../views/partials/'));

app.set('view engine', 'hbs');
app.set('views', path.resolve(__dirname, '../views/'));



// Security støff

app.use(helmet.hsts({
    maxAge              : 15724800000,  // 26 weeks
    includeSubdomains   : true,
    preload             : true
}));

app.use(helmet.frameguard('deny'));

app.use(helmet.csp({
    defaultSrc: ["'none'"],
    scriptSrc: ["'self'", "'unsafe-inline'", "www.google-analytics.com", "ssl.google-analytics.com"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", "data:", "server.arcgisonline.com", "ssl.google-analytics.com"],
    frameSrc: ["eventbrite.com", "www.eventbrite.com"],
    fontSrc: ["'self'"],
    connectSrc: ["*"],
    sandbox: ['allow-forms', 'allow-scripts'],
    reportUri: '/api/v1/csp',
    reportOnly: true,       // set to true if you only want to report errors
    setAllHeaders: true,    // set to true if you want to set all headers
    safari5: false          // set to true if you want to force buggy CSP in Safari 5
}));



// Set up routes

app.post('/api/v1/csp', routeCsp);

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(expressValidator());
app.post('/api/v1/openmic', openmic);
app.post('/api/v1/scholarship', scholarship);


// Ping route for external monitoring

app.get('/admin/ping', function (req, res) {
    res.status(200).send('OK');
});



// Set up routes only used in development

if (config.get('env') === 'development') {
    app.get('/css/app.css', routeAssets.appCss);
    app.get('/js/app.js', routeAssets.appJs);
}



// Set http routes

app.get('/', function (req, res) {
    res.render('index', {
        pageTitle: 'Web Rebels ☠ Oslo ☠ 21-22 May 2015',
        header: 'penthouse',
        css: css
    });
});
app.get('/index', function (req, res) {
    res.render('index', {
        pageTitle: 'Web Rebels ☠ Oslo ☠ 21-22 May 2015',
        css: css
    });
});
app.get('/sponsors', function (req, res) {
    res.render('sponsors', {
        pageTitle: 'Our sponsors without whom none of this would be possible ☠ Web Rebels ☠ Oslo 2015',
        css: css
    });
});
app.get('/sponsors/packages', function (req, res) {
    res.render('sponsorPackages', {
        pageTitle: 'Sponsoring options for the Web Rebels Conference ☠ Oslo 2015',
        css: css
    });
});
app.get('/about', function (req, res) {
    res.render('about', {
        pageTitle: 'About the Web Rebels Conference ☠ Oslo 2015',
        css: css
    });
});
app.get('/videos', function (req, res) {
    res.render('videos', {
        pageTitle: 'Videos from the Web Rebels Conference ☠ Oslo 2015',
        css: css
    });
});
app.get('/policies', function (req, res) {
    res.render('policies', {
        pageTitle: 'Policies for the Web Rebels Web Rebels Conference ☠ Oslo 2015',
        css: css
    });
});
app.get('/tickets', function (req, res) {
    res.render('tickets', {
        pageTitle: 'Tickets for the Web Rebels Web Rebels Conference ☠ Oslo 2015',
        css: css
    });
});
app.get('/tickets/confirmation', function (req, res) {
    res.render('ticketConfirmation', {
        pageTitle: 'Thank you for registering with the Web Rebels Conference ☠ Oslo 2015',
        css: css
    });
});
app.get('/location', function (req, res) {
    res.render('location', {
        pageTitle: 'Location of the Web Rebels Web Rebels Conference ☠ Oslo 2015',
        css: css
    });
});
app.get('/oslo', function (req, res) {
    res.render('oslo', {
        pageTitle: 'Oslo survival guide for the Web Rebels Web Rebels Conference ☠ Oslo 2015',
        header: 'oslosurvival',
        css: css
    });
});
app.get('/family', function (req, res) {
    res.render('family', {
        pageTitle: 'Family guide for the Web Rebels Web Rebels Conference ☠ Oslo 2015',
        css: css
    });
});
app.get('/openmic', function (req, res) {
    res.render('openmic', {
        pageTitle: 'Open Mic Night at the Web Rebels Web Rebels Conference ☠ Oslo 2015',
        css: css
    });
});
app.get('/schedule', function (req, res) {
    res.render('schedule', {
        pageTitle: 'Schedule for the Web Rebels Web Rebels Conference ☠ Oslo 2015',
        css: css
    });
});
app.get('/speakers', function (req, res) {
    res.render('speakers', {
        pageTitle: 'Speakers at the Web Rebels Web Rebels Conference ☠ Oslo 2015',
        css: css
    });
});
app.get('/roadbook', function (req, res) {
    res.render('roadbook', {
        pageTitle: 'Roadbook for the Web Rebels Web Rebels Conference speakers ☠ Oslo 2015',
        css: css
    });
});
app.get('/scholarship', function (req, res) {
    res.render('scholarship', {
        pageTitle: 'Web Rebels Scholarship Programme Web Rebels Conference ☠ Oslo 2015',
        css: css
    });
});



// Set up http server

var httpServer = http.createServer(app);



// Export application

module.exports = httpServer;
