// postShuffle -- web forum software for node.js
// Copyright (c) 2012 Mooneer Salem

var ControllerBase = require("../Utility/ControllerBase");
var util           = require("util");
var DataModel      = require("../DataModel");

module.exports = (function() {
    /**
     * Creates new Controller object.
     * @param {Object} app Express app object.
     * @return {Object} The new object.
     */
    var Post = function(app) {
        Post.super_.call(this, app);
    };
    
    util.inherits(Post, ControllerBase);
    
    /**
     * Links controller's routes to application.
     */
    Post.prototype.link_routes = function() {
        this.__app.post("/json/post", this.json(this.add_new_post));
    };
    
    /**
     * Adds a new post.
     * @param {Object} json_args Arguments passed in by browser.
     * @returns {Array} Data corresponding to the new post.
     */
    Post.prototype.add_new_post = function(json_args) {
        
    };
    
    return Post;
})();