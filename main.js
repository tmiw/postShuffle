// postShuffle -- web forum software for node.js
// Copyright (c) 2012 Mooneer Salem

var express = require('express');
var app = express();
var routes = require(__dirname + '/Controller.js');

routes.page_index_get = function(req, res) { res.send("hai"); };
routes.page_index_name_get = function(req, res) { res.send("hai " + req.params["name"]); };

var r = new routes.Controller(app);

app.listen(process.env.PORT);