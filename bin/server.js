/* jshint node: true, strict: true */

"use strict";

var http    = require('http'),
    app     = require('./app.js'),
    config  = require('./config.js'),
    log     = require('./log.js');

// Start http server

app.start();
log.info('Web Rebels 2014 website running at http://localhost:' + config.get('httpServerPort') + '/');
log.info('Using templates in ' + config.get('viewRoot'));
log.info('Serving static files from ' + config.get('docRoot'));

