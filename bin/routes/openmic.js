/* jshint node: true, strict: true */

"use strict";

var config          = require('../config.js'),
    fs              = require('fs'),
    path            = require('path'),
    log             = require('../log.js'),
    mandrill        = require('mandrill-api/mandrill'),
    mandrill_client = new mandrill.Mandrill(config.get('mandrillApiKey'));

module.exports = function(req, res){

    req.assert('name', 'Name is empty').notEmpty();

    req.assert('email', 'Email is empty').notEmpty();
    req.assert('email', 'Email is invalid.').isEmail();

    req.assert('description', 'Description is empty').notEmpty();

    var errors = req.validationErrors();
    if (errors) {
        renderWithMessage(res, errors);
    } else {
        sendMail(req.param('name'), req.param('email'), req.param('description'), function sendingOk(err) {
            if(err) {
                renderWithMessage(res, {msg: 'Sorry we had trouble sending your email. Please try again at a later time.'});
            } else {
                renderWithMessage(res, null, {
                    msg: 'We got your email! We\'ll send you an email when we know who we picked for Open Mic.'});
            }
        });
    }
};

function sendMail(name, email, description, callback) {
    var content =   "Name: " + name + "\n" +
                    "Email: " + email + "\n" +
                    "Pitch: " + description + "\n";
    var message = {
        "text": content,
        "subject": "Open Mic request " + name,
        "from_email": "openmic@webrebels.org",
        "from_name": "Open Mic",
        "to": [{
            "email": "openmic@webrebels.org",
            "name": "Open Mic",
            "type": "to"
        }],
        "headers": {
            "Reply-To": email
        }
    };

    mandrill_client.messages.send({"message": message, "async": false, "ip_pool": "Main Pool"}, function(result) {
        log.info("Open Mic email success");
        log.info(result);
        callback(null);
    }, function(e) {
        log.info("Open Mic email failed. " +
            "Name: " + name +
            " Email: " + email +
            " Description: " + description + ".");
        // Mandrill returns the error as an object with name and message keys
        log.error('A mandrill error occurred: ' + e.name + ' - ' + e.message);
        callback("Error");
    });
}

function renderWithMessage(res, error, success) {
    res.render('openmic', {
        pageTitle: 'Open Mic Night at the Web Rebels Web Rebels Conference ☠ Oslo 2015',
        errors: error,
        success: success,
        css: fs.readFileSync(path.resolve(__dirname, '../../' + config.get('docRoot') + '/css/structure.css'), {encoding:'utf8'})
    });
}



