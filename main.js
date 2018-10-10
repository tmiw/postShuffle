// postShuffle -- web forum software for node.js
// Copyright (c) 2012 Mooneer Salem

var express = require('express');
var app = express();
var Controller = require(__dirname + '/Controller');
var AppConfig = require('./AppConfig.js');
var consolidate = require('consolidate');

// Initialize Express middleware.
var compression = require('compression')
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var expressSession = require('express-session')
var serveIndex = require('serve-index')
var serveStatic = require('serve-static')

app.use(compression());
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(cookieParser(AppConfig.sessionSecret, {}));
app.use(expressSession());
app.use('/static', serveIndex(__dirname + '/static'));
app.use('/static', serveStatic(__dirname + '/static'));

// Triggers initialization of database.
var database = require(__dirname + '/DataModel');

// Initialize controller.
var controller = new Controller(app);
controller.link_routes(__dirname);

// Initialize template engine.
app.engine('html', consolidate.mustache);
app.set('view engine', 'html');
app.set('views', __dirname + '/templates');

// Begin listening for connections.
var portNumber = process.env.PORT;
if (!portNumber)
{
    // Default to 8080 if not specified.
    portNumber = 8080;
}
app.listen(8080);
