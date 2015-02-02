/* jshint node: true, strict: true */

"use strict";

var browserify      = require('browserify'),
    CombinedStream  = require('combined-stream'),
    log             = require('../log.js'),
    path            = require('path'),
    fs              = require('fs');



// Convert and serve commonJS modules as a js bundle

module.exports.appJs = function(req, res){
    res.writeHead(200, {'Content-Type' : 'application/javascript'});
    browserify('./src/js/init.js')
        .bundle()
        .pipe(res);
};



// Concatinate and serve CSS

module.exports.libCss = function(req, res){
    var combined = CombinedStream.create({pauseStreams: false});
    res.writeHead(200, {'Content-Type' : 'text/css'});
    combined.append(fs.createReadStream(path.resolve(__dirname, '../../src/fonts/ratherloud.css')));
    combined.append(fs.createReadStream(path.resolve(__dirname, '../../src/css/styles.css')));
    combined.pipe(res);
};
