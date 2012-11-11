// postShuffle -- web forum software for node.js
// Copyright (c) 2012 Mooneer Salem

var ControllerBase = require("../Utility/ControllerBase");
var Home           = require("./Home");
var Post           = require("./Post");
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
        this.Post = new Post(app);
    };
    
    util.inherits(Controller, ControllerBase);
    
    /**
     * Links controller's routes to application.
     */
    Controller.prototype.link_routes = function() { 
        this.Home.link_routes();
        this.Post.link_routes();
        
        // TODO: static middleware should be handling these.
        this.__app.get(
            /^\/static\/css\/layout.css$/, 
            function (req, res) {
                res.sendfile("static/css/layout.css");
            });
        
        this.__app.get(
            /^\/static\/js\/postshuffle-client.js$/, 
            function (req, res) {
                res.sendfile("static/js/postshuffle-client.js");
            });
            
        // Map URL path for backbone/underscore to our node_modules folder
        // so that npm can track this for us.
        this.__app.get(
            /^\/static\/js\/backbone.js$/, 
            function (req, res) {
                res.sendfile("node_modules/backbone/backbone.js");
            });
        
        this.__app.get(
            /^\/static\/js\/underscore.js$/, 
            function (req, res) {
                res.sendfile("node_modules/backbone/node_modules/underscore/underscore.js");
            });
    };
    
    return Controller;
})();