// postShuffle -- web forum software for node.js
// Copyright (c) 2012 Mooneer Salem

var ControllerBase = require("../Utility/ControllerBase");

/**
 * Shows greeting without the person's name.
 * @param {Object} req Request object.
 * @param {Object} res Response object.
 */
var show_without_name = function(req, res) {
    res.send("hai");
};

/**
 * Shows greeting with the person's name.
 * @param {Object} req Request object.
 * @param {Object} res Response object.
 */
var show_with_name = function(req, res) {
    res.send("hai " + req.params.name);
};

/**
 * Links controller's routes to application.
 */
var link_routes = function() {
    this.__app.get("/", this.__show_without_name);
    this.__app.get("/:name", this.__show_with_name);  
};

/**
 * Creates new Controller object.
 * @param {Object} app Express app object.
 * @return {Object} The new object.
 */
module.exports = function(app) {
    var that = new ControllerBase(app);
    that.link_routes = link_routes;
    
    // Copy functions to instance-level properties to enable testability.
    that.__show_without_name = show_without_name;
    that.__show_with_name = show_with_name;
    
    return that;
};