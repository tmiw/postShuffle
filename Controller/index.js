// postShuffle -- web forum software for node.js
// Copyright (c) 2012 Mooneer Salem

var   Home           = require("./Home")
    , ControllerBase = require("../Utility/ControllerBase")
    , util           = require("util");

/**
 * Creates new Controller object.
 * @param {Object} app Express app object.
 * @return {Object} The new object.
 */
var Controller = function(app) {
    ControllerBase.call(this, app);
    
    this.Home = new Home(app);
};

util.inherits(Controller, ControllerBase);

/**
 * Links controller's routes to application.
 */
Controller.prototype.link_routes = function() { 
    this.Home.link_routes();
};

module.exports = Controller;