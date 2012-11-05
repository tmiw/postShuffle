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
    var Home = function(app) {
        Home.super_.call(this, app);
    };
    
    util.inherits(Home, ControllerBase);
    
    /**
     * Links controller's routes to application.
     */
    Home.prototype.link_routes = function() {
        /*this.__app.get("/", this.__show_without_name);
        this.__app.get("/:name", this.__show_with_name);  */
        
        // Need a better way to do this. Would like to share logic between 
        // JSON output (for AJAX) and standard HTML.
        this.__app.get("/", this.json(this.get_front_page_posts));
    };
    
    /**
     * Shows greeting without the person's name.
     * @param {Object} req Request object.
     * @param {Object} res Response object.
     */
    Home.prototype.show_without_name = function(req, res) {
        res.send("hai");
    };
    
    /**
     * Shows greeting with the person's name.
     * @param {Object} req Request object.
     * @param {Object} res Response object.
     */
    Home.prototype.show_with_name = function(req, res) {
        res.send("hai " + req.params.name);
    };
    
    /**
     * Retrieves posts for the front page, given a list of tags
     * and an offset.
     * @param {Array} tag_list A list of tags.
     * @param {Integer} offset The number of posts to skip.
     * @return {Array} The list of posts.
     */
    Home.prototype.get_front_page_posts = function(tag_list, offset) {
        var self = this;
        var query = {
            'offset': offset, 
            'limit': 20
        };
        
        var success_f = function(list) {
                self.emitSuccess({
                    'posts': list
                });
            };
        
        if (tag_list)
        {
            query.include = [ 'Tag' ];
            query.where = {
                'Tags.tag': tag_list
            };
            DataModel.Posts.findAll(query).success(success_f);
        }
        else
        {
            DataModel.Posts.findAll(query).success(success_f);
        }
        
        return self;
    };
    
    return Home;
})();