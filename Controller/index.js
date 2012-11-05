// postShuffle -- web forum software for node.js
// Copyright (c) 2012 Mooneer Salem

var ControllerBase = require("../Utility/ControllerBase");
var Home           = require("./Home");
var util           = require("util");

module.exports = (function() {
    /**
     * Creates new Controller object.
     * @param {Object} app Express app object.
     * @return {Object} The new object.
     */
    var Controller = function(app) {
        Controller.super_.call(this, app);
        
        this.Home = new Home(app);
    };
    
    util.inherits(Controller, ControllerBase);
    
    /**
     * Links controller's routes to application.
     */
    Controller.prototype.link_routes = function() { 
        this.Home.link_routes();
    };
    
    return Controller;
})();