// postShuffle -- web forum software for node.js
// Copyright (c) 2012 Mooneer Salem

var express = require('express');
var app = express();
var Controller = require(__dirname + '/Controller');
var AppConfig = require('./AppConfig.js');
var consolidate = require('consolidate');

// Initialize Express middleware.
app.use(express.compress());
app.use(express.bodyParser());
app.use(express.cookieParser(AppConfig.sessionSecret));
app.use(express.session());
app.use('/static', express.directory(__dirname + '/static'));
app.use('/static', express.static(__dirname + '/static'));

// Triggers initialization of database.
var database = require(__dirname + '/DataModel');

// Initialize controller.
var controller = new Controller(app);
controller.link_routes();

// Initialize template engine.
app.engine('html', consolidate.mustache);
app.set('view engine', 'html');
app.set('views', __dirname + '/templates');

// Begin listening for connections.
app.listen(process.env.PORT);