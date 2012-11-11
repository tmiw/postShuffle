// postShuffle -- web forum software for node.js
// Copyright (c) 2012 Mooneer Salem

var express = require('express');
var app = express();
var Controller = require(__dirname + '/Controller');
var AppConfig = require('./AppConfig.js');
var consolidate = require('consolidate');

// Load config
var config = new AppConfig();

// Initialize Express middleware.
app.use(express.compress());
app.use(express.bodyParser());
app.use(express.cookieParser(config.sessionSecret));
app.use(express.cookieSession({
    secret: config.sessionSecret
}));
app.use(express.directory(__dirname + 'static'));
app.use(express.static(__dirname + 'static'));

// Triggers initialization of database.
require(__dirname + '/DataModel');

// Initialize controller.
var controller = new Controller(app);
controller.link_routes();

// Initialize template engine.
app.engine('html', consolidate.mustache);
app.set('view engine', 'html');
app.set('views', __dirname + '/templates');

// Begin listening for connections.
app.listen(process.env.PORT);