/* jshint node: true, strict: true */

"use strict";

var browserify      = require('browserify'),
    CombinedStream  = require('combined-stream'),
    log             = require('../log.js'),
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
    combined.append(fs.createReadStream('./public/src/css/style.css'));
    combined.pipe(res);
};
