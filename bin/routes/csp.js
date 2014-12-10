/* jshint node: true, strict: true */

"use strict";

var body    = require('body/json'),
    config  = require('../config.js'),
    log     = require('../log.js');



// Content Security Policy reporting

module.exports = function(req, res){
    body(req, res, {}, function(err, bodyObj) {
        if (err) {
            log.error('Error parsing CSP violation report', err);
            res.status(500).send("Internal server error");
            return;
        }
        res.status(200).send('OK');
    });
};
