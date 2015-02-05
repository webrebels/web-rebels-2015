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
    browserify(fs.createReadStream(path.resolve(__dirname, '../../src/js/script.js')))
        .bundle()
        .pipe(res);
};



// Concatinate and serve CSS

module.exports.foldCss = function(req, res){
    var combined = CombinedStream.create({pauseStreams: false});
    res.writeHead(200, {'Content-Type' : 'text/css'});
    combined.append(fs.createReadStream(path.resolve(__dirname, '../../src/fonts/ratherloud.css')));
    combined.append(fs.createReadStream(path.resolve(__dirname, '../../src/css/structure.css')));
    combined.pipe(res);
};


module.exports.appCss = function(req, res){
    var combined = CombinedStream.create({pauseStreams: false});
    res.writeHead(200, {'Content-Type' : 'text/css'});
    combined.append(fs.createReadStream(path.resolve(__dirname, '../../src/css/styles.css')));
    combined.pipe(res);
};
