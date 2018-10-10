// postShuffle -- web forum software for node.js
// Copyright (c) 2012 Mooneer Salem

var ControllerBase = require("../Utility/ControllerBase");
var Post           = require("./Post");
var Tag            = require("./Tag");
var User           = require("./User");
var Comment        = require("./Comment");
var util           = require("util");

module.exports = (function() {
    /**
     * Creates new Controller object.
     * @param {Object} app Express app object.
     * @return {Object} The new object.
     */
    var Controller = function(app) {
        Controller.super_.call(this, app);

        this.Post = new Post(app);
        this.Tag = new Tag(app);
        this.Comment = new Comment(app);
        this.User = new User(app);
    };
    
    util.inherits(Controller, ControllerBase);
    
    /**
     * Links controller's routes to application.
     */
    Controller.prototype.link_routes = function(base_dir) { 
        this.Post.link_routes();
        this.Tag.link_routes();
        this.Comment.link_routes();
        this.User.link_routes();
        
        // Map URL path for backbone/underscore to our node_modules folder
        // so that npm can track this for us.
        this.__app.get(
            /^\/static\/js\/backbone.js$/, 
            function (req, res) {
                res.sendFile(base_dir + "/node_modules/backbone/backbone.js");
            });
        
        this.__app.get(
            /^\/static\/js\/underscore.js$/, 
            function (req, res) {
                res.sendFile(base_dir + "/node_modules/underscore/underscore.js");
            });
    };
    
    return Controller;
})();
