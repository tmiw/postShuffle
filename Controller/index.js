// postShuffle -- web forum software for node.js
// Copyright (c) 2012 Mooneer Salem

var Home = require("./Home");
var ControllerBase = require("../Utility/ControllerBase");

/**
 * Links controller's routes to application.
 */
var link_routes = function() { 
    this.Home.link_routes();
};

/**
 * Creates new Controller object.
 * @param {Object} app Express app object.
 * @return {Object} The new object.
 */
module.exports = function(app) {
    var that = new ControllerBase(app);
    that.Home = new Home(app);
    that.link_routes = link_routes;
    
    return that;
};