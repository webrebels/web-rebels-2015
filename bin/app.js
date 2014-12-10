/* jshint node: true, strict: true */

"use strict";

var config      = require('./config.js'),
    log         = require('./log.js'),
    hapi        = require('hapi'),
    Hapi        = require('hapi'),
    externals   = {
        js      : (config.get('env') === 'development') ? config.get('jsFiles') : config.get('jsMinFile'),
        css     : (config.get('env') === 'development') ? config.get('cssFiles') : config.get('cssMinFile')
    };

var server = new Hapi.Server(config.get('httpServerPort'));
server.views({
    engines: {
        'html': {
            module: require('handlebars'),
            compileMode: 'sync'
        }
    },
    basePath: __dirname,
    path: '../views',
    partialsPath: '../views/partials',
    compileMode: 'async'
});

server.route({
    method: 'GET',
    path: '/{path*}',
    handler: {
        directory: { path: './public', listing: false, index: true }
    }
});

server.route({
    method: 'GET',
    path: '/',
    handler: function(request, reply) {
        reply.view('index', {
            pageTitle: 'Web Rebels 2015'
        });
    }
});

server.route({
    method: 'GET',
    path: '/sponsors/packages',
    handler: function(request, reply){
        reply.view('sponsor_packages', {
            pageTitle: 'Web Rebels Sponsorship Packages'
        })
    }
});
module.exports = server;
