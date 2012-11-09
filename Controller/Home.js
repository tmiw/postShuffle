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
        this.__app.get("/json", this.json(this.get_front_page_posts));
        this.__app.get("/", this.html(this.get_front_page_posts, 'index', 'PostShuffle: home'));
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
        
        var failure_f = function(err) {
            self.emitFailure(err);
        };
        
        var success_f = function(list) {
            var result = [];
            var tag_f = function(idx, tags) {
                var tag_strings = [];
                
                for (var i in tags)
                {
                    tag_strings.push(tags[i].tag);
                }
                
                list[idx].getUser().success(function(u) {
                    list[idx].getComments().success(function(c) {
                        result.push({
                            'tags': tag_strings,
                            'title': list[idx].title,
                            'author': {
                                'username': u.username,
                                'title': u.title,
                                'is_moderator': u.is_moderator,
                                'is_admin': u.is_admin,
                                'joined': u.createdAt
                            },
                            'body': list[idx].body,
                            'id': list[idx].id,
                            'create_date': list[idx].createdAt,
                            'update_date': list[idx].updatedAt,
                            'num_comments': c.length
                        });
                        
                        if (idx + 1 < list.length)
                        {
                            list[idx + 1].getTags().success(function(v) {
                                tag_f(idx + 1, v);
                            }).error(failure_f);
                        }
                        else 
                        {
                            self.emitSuccess({
                                'posts': result
                            });
                        }
                    }).error(failure_f);
                }).error(failure_f);
            };
            
            // recursive. not sure if this is good for large result sets.
            if (list.length > 0)
            {
                list[0].getTags().success(function(v) {
                    tag_f(0, v);
                }).error(failure_f);
            }
            else 
            {
                self.emitSuccess({
                    'posts': result
                });
            }
        };
        
        if (tag_list)
        {
            query.include = [ 'Tag' ];
            query.where = {
                'Tags.tag': tag_list
            };
            DataModel.Posts.findAll(query).success(success_f).error(failure_f);
        }
        else
        {
            DataModel.Posts.findAll(query).success(success_f).error(failure_f);
        }
        
        return self;
    };
    
    return Home;
})();