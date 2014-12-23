/* jshint node: true, strict: true */

"use strict";

var http            = require('http'),
    config          = require('./config.js'),
    log             = require('./log.js'),

    helmet          = require('helmet'),
    express         = require('express'),
    compress        = require('compression')(),
    serveStatic     = require('serve-static'),
    exphbs          = require('express-handlebars'),

    app             = express(),

    middleSSL       = require('./middleware/ssl.js'),
    routeCsp        = require('./routes/csp.js'),
    routeAssets     = require('./routes/assets.js');



// Max out the number of socket connections.
// Default concurrent sockets in node.js is 5. We need more!

http.globalAgent.maxSockets = Infinity;



// Configure application

app.disable('x-powered-by');
app.enable('trust proxy');



// Set middleware

app.use(middleSSL.ensure);
app.use(compress);
app.use(serveStatic(config.get('docRoot')));



// Set up template engine

var hbs = exphbs.create({
    defaultLayout: 'main',
    partialsDir: [
        'views/partials/'
    ]
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');



// Security støff

app.use(helmet.hsts({
    maxAge              : 15724800000,  // 26 weeks
    includeSubdomains   : true
}));

app.use(helmet.frameguard('deny'));

app.use(helmet.csp({
    defaultSrc: ["'none'"],
    scriptSrc: ["'self'", "'unsafe-inline'", "www.google-analytics.com"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", "data:", "server.arcgisonline.com"],
    connectSrc: ["*"],
    sandbox: ['allow-forms', 'allow-scripts'],
    reportUri: '/api/v1/csp',
    reportOnly: true,       // set to true if you only want to report errors
    setAllHeaders: true,    // set to true if you want to set all headers
    safari5: false          // set to true if you want to force buggy CSP in Safari 5
}));



// Set up routes

app.post('/api/v1/csp', routeCsp);



// Ping route for external monitoring

app.get('/admin/ping', function (req, res) {
    res.status(200).send('OK');
});



// Set up routes only used in development

if (config.get('env') === 'development') {
    app.get('/css/app.css', routeAssets.libCss);
    app.get('/js/app.js', routeAssets.appJs);
}



// Set http routes

app.get('/', function (req, res) {
    res.render('layouts/index', {
        pageTitle: 'Web Rebels ☠ Oslo ☠ 22-23 May 2014'
    });
});
app.get('/index', function (req, res) {
    // res.render('index', {externals: externals, pageTitle: 'Web Rebels ☠ Oslo ☠ 2014' });
});
app.get('/sponsors', function (req, res) {
    // res.render('sponsors', {externals: externals, pageTitle: 'Our sponsors without whom none of this would be possible ☠ Web Rebels ☠ Oslo 2014'});
});
app.get('/sponsoroptions', function (req, res) {
    // res.render('sponsoroptions', {externals: externals, pageTitle: 'Sponsoring options for the Web Rebels ☠ Oslo 2014'});
});
app.get('/about', function (req, res) {
    // res.render('about', {externals: externals, pageTitle: '☠ About the Web Rebels ☠'});
});
app.get('/videos', function (req, res) {
    // res.redirect('http://vimeo.com/channels/wr2014');
});
app.get('/policies', function (req, res) {
    // res.render('policies', {externals: externals, pageTitle: '☠ Policies for the Web Rebels ☠'});
});
app.get('/tickets', function (req, res) {
    // res.render('tickets', {externals: externals, pageTitle: 'Tickets for the Web Rebels ☠ Oslo 2014'});
});
app.get('/ticketConfirmation', function (req, res) {
    // res.render('ticketConfirmation', {externals: externals, pageTitle: 'Thank you for registering with the Web Rebels ☠ Oslo 2014'});
});
app.get('/location', function (req, res) {
    // res.render('location', {externals: externals, pageTitle: 'Location of the Web Rebels ☠ Oslo 2014'});
});
app.get('/oslo', function (req, res) {
    // res.render('oslo', {externals: externals, pageTitle: 'Oslo survival guide for Web Rebels ☠ Oslo 2014'});
});
app.get('/family', function (req, res) {
    // res.render('family', {externals: externals, pageTitle: 'Family guide for Web Rebels ☠ Oslo 2014'});
});
app.get('/openmic', function (req, res) {
    // res.render('openmic', {externals: externals, pageTitle: 'Open Mic Night - Web Rebels ☠ Oslo 2014'});
});
app.get('/schedule', function (req, res) {
    // res.render('schedule', {externals: externals, pageTitle: 'Schedule for Web Rebels ☠ Oslo 2014'});
});
app.get('/speakers', function (req, res) {
    // res.render('speakers', {externals: externals, pageTitle: 'Speakers - Web Rebels ☠ Oslo 2014'});
});
app.get('/roadbook', function (req, res) {
    // res.render('roadbook', {externals: externals, pageTitle: 'Speakers Roadbook - Web Rebels ☠ Oslo 2014'});
});



// Set up http server

var httpServer = http.createServer(app);



// Export application

module.exports = httpServer;
