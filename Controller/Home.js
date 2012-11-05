// postShuffle -- web forum software for node.js
// Copyright (c) 2012 Mooneer Salem

var ControllerBase = require("../Utility/ControllerBase");
var DataModel = require("../DataModel");

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
 * Retrieves posts for the front page, given a list of tags
 * and an offset.
 * @param {Array} tag_list A list of tags.
 * @param {Integer} offset The number of posts to skip.
 * @return {Array} The list of posts.
 */
var get_front_page_posts = function(tag_list, offset) {
    DataModel.Posts.findAll({
        'offset': offset, 
        'limit': 20}).success(function(list) {
            return list;
        });
};

/**
 * Links controller's routes to application.
 */
var link_routes = function() {
    /*this.__app.get("/", this.__show_without_name);
    this.__app.get("/:name", this.__show_with_name);  */
    
    // Need a better way to do this. Would like to share logic between 
    // JSON output (for AJAX) and standard HTML.
    this.__app.get("/", function(req, res) { res.send(get_front_page_posts([], 0)); });
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