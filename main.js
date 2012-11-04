// postShuffle -- web forum software for node.js
// Copyright (c) 2012 Mooneer Salem

var express = require('express');
var app = express();

var Controller = require(__dirname + '/Controller');

// Triggers initialization of database.
require(__dirname + '/DataModel');

var controller = new Controller(app);
controller.link_routes();

app.listen(process.env.PORT);