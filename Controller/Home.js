// postShuffle -- web forum software for node.js
// Copyright (c) 2012 Mooneer Salem

var ControllerBase = require("../Utility/ControllerBase");

var show_without_name = function(req, res) {
    res.send("hai");
};

var show_with_name = function(req, res) {
    res.send("hai " + req.params["name"]);
};

var link_routes = function() {
    this.__app.get("/", this.__show_without_name);
    this.__app.get("/:name", this.__show_with_name);  
};

module.exports = function(app) {
    var that = new ControllerBase(app);
    that.link_routes = link_routes;
    
    // Copy functions to instance-level properties to enable testability.
    that.__show_without_name = show_without_name;
    that.__show_with_name = show_with_name;
    
    return that;
};