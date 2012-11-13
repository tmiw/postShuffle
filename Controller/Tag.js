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
    var Tag = function(app) {
        Tag.super_.call(this, app);
    };
    
    util.inherits(Tag, ControllerBase);
    
    /**
     * Links controller's routes to application.
     */
    Tag.prototype.link_routes = function() {
        this.__app.get(
            /^\/tag$/, 
            this.get_tags);
    };
    
    /**
     * Retrieves list of tags.
     * @param {Object} req Request object.
     * @param {Object} res Response object.
     */
    Tag.prototype.get_tags = function(req, res) {
        var success_f = function(tags) {
            var tag_only = [];
            for (var i in tags)
            {
                tag_only.push(tags[i].tag);
            }
            res.send(tag_only);
        };
        
        var term_start = req.query.term || "";
        DataModel.Tags.findAll({
            where: ['tag LIKE ?', term_start + "%"]
        }).success(success_f);
    };
    
    return Tag;
})();