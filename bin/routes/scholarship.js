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

    req.assert('country', 'Country is empty.').notEmpty();

    req.assert('application', 'Application is empty').notEmpty();

    var errors = req.validationErrors();
    if (errors) {
        renderWithMessage(res, errors);
    } else {
        sendMail(req.param('name'), req.param('email'), req.param('application'), req.param('country'), function sendingOk(err) {
            if(err) {
                renderWithMessage(res, {msg: 'Sorry we had trouble sending your email. Please try again at a later time.'});
            } else {
                renderWithMessage(res, null, {
                    msg: 'We got your application!'});
            }
        });
    }
};

function sendMail(name, email, application, country, callback) {
    var content =   "Name: " + name + "\n" +
                    "Email: " + email + "\n" +
                    "Country: " + country + "\n" +
                    "Application: " + application + "\n";
    var message = {
        "text": content,
        "subject": "Scholarship Application " + name,
        "from_email": "scholarship@webrebels.org",
        "from_name": "Scholarship Application",
        "to": [{
            "email": "kontor@webrebels.org",
            "name": "Webrebels Kontor",
            "type": "to"
        }],
        "headers": {
            "Reply-To": email
        }
    };

    mandrill_client.messages.send({"message": message, "async": false, "ip_pool": "Main Pool"}, function(result) {
        log.info("Scholarship email success");
        log.info(result);
        callback(null);
    }, function(e) {
        log.info("Scholarship email failed. " +
            "Name: " + name +
            " Email: " + email +
            " Country: " + country +
            " Description: " + application + ".");
        // Mandrill returns the error as an object with name and message keys
        log.error('A mandrill error occurred: ' + e.name + ' - ' + e.message);
        callback("Error");
    });
}

function renderWithMessage(res, error, success) {
    res.render('scholarship', {
        pageTitle: 'Web Rebels Scholarship Programme Web Rebels Conference ☠ Oslo 2015',
        errors: error,
        success: success,
        css: fs.readFileSync(path.resolve(__dirname, '../../' + config.get('docRoot') + '/css/structure.css'), {encoding:'utf8'})
    });
}
