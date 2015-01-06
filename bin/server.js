/* jshint node: true, strict: true */

"use strict";

var fs      = require('fs'),
    net     = require('net'),
    repl    = require('repl'),
    server  = require('./app.js'),
    config  = require('./config.js'),
    log     = require('./log.js');



// Start application

server.listen(config.get('httpServerPort'), function () {
    log.info('Web Rebels 2015 website running at http://localhost:' + config.get('httpServerPort') + '/');
    log.info('server process has pid ' + process.pid);
    log.info('serving static files from ' + config.get('docRoot'));
});



// Expose a REPL

var replPath = './repl.' + config.get('httpServerPort') + '.sock';

var netRepl = net.createServer(function (socket) {
    log.info('user connected to the REPL');
    var replServer = repl.start({
        prompt: 'wr > ',
        input: socket,
        output: socket,
        terminal: true,
        useGlobal: false
    }).on('exit', function () {
        log.info('user exited the REPL');
        socket.end();
    }).on('error', function (err) {
        log.error('repl error');
        log.error(err);
    });

    replServer.context.server = server;
    replServer.context.config = config;
    replServer.context.log = log;

});

fs.unlink(replPath, function () {
    netRepl.listen(replPath, function () {
        log.info('repl available at ' + replPath);
    });
});



// Catch uncaught exceptions, log it and take down server in a nice way.
// Upstart or forever should handle kicking the process back into life!

process.on('uncaughtException', function (err) {
    log.error('shutdown - server taken down by force due to a uncaughtException');
    log.error(err.message);
    log.error(err.stack);
    netRepl.close();
    server.close();
    process.nextTick(function () {
        process.exit(1);
    });
});



// Listen for SIGINT (Ctrl+C) and do a gracefull takedown of the server

process.on('SIGINT', function () {
    log.info('shutdown - got SIGINT - taking down server gracefully');
    netRepl.close();
    server.close();
    process.nextTick(function () {
        process.exit(0);
    });
});



// Listen for SIGTERM (Upstart) and do a gracefull takedown of the server

process.on('SIGTERM', function () {
    log.info('shutdown - got SIGTERM - taking down server gracefully');
    netRepl.close();
    server.close();
    process.nextTick(function () {
        process.exit(0);
    });
});
