/* jshint node: true, strict: true */

"use strict";

var path    = require('path'),
    convict = require('convict'),
    pckage  = require('../package.json');



// Configuration schema

var conf = convict({
env: {

    doc: "Applicaton environments",
        format  : ["development", "production"],
        default : "development",
        env     : "NODE_ENV",
        arg     : "env"
    },

    version: {
        doc     : "Version of the application",
        format  : "*",
        default : pckage.version
    },

    httpServerPort: {
        doc     : "The port the server should bind to",
        format  : "port",
        default : 8000,
        env     : "PORT",
        art     : "port"
    },

    docRoot: {
        doc     : "Document root for static files to be served by the http server",
        format  : "*",
        default : "/public",
        env     : "NODE_HTTP_DOC_ROOT"
    },

    logConsoleLevel: {
        doc     : "Which level the console transport log should log at",
        format  : "*",
        default : "info",
        env     : "NODE_LOG_CONSOLE_LEVEL",
        arg     : "log-console-level"
    },

    logConsoleSilent: {
        doc     : "If the console transport log should be silent or not",
        format  : "*",
        default : false,
        env     : "NODE_LOG_CONSOLE_SILENT",
        arg     : "log-console-silent"
    }

});



// Load and validate configuration depending on environment

var env = conf.get('env');
conf.loadFile(path.resolve(__dirname, '../config/', env + '.json'));
conf.validate();



// Export merged configuration to the application

module.exports = conf;
