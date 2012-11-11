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
        this.__app.put("/post", this.json(this.add_new_post));
    };
    
    /**
     * Adds a new post.
     * @param {Object} json_args Arguments passed in by browser.
     * @param {Object} session_data Current session data.
     * @returns {Array} Data corresponding to the new post.
     */
    Post.prototype.add_new_post = function(json_args, session_data) {
        var self = this;
        
        if (!json_args.title || !json_args.body)
        {
            this.emitFailure("Must provide a title and body.");
        }
        else 
        {
            // TODO: find valid user.
            DataModel.Users.find(1).success(function(user) {
                DataModel.Posts.create({
                    'title': json_args.title,
                    'body': json_args.body
                }).success(function(post) {
                    user.addPost(post).success(function() {
                        // TODO: add tags
                        self.emitSuccess({
                            'tags': [],
                            'title': post.title,
                            'author': {
                                'username': user.username,
                                'title': user.title,
                                'is_moderator': user.is_moderator,
                                'is_admin': user.is_admin,
                                'joined': user.createdAt
                            },
                            'body': post.body,
                            'id': post.id,
                            'create_date': post.createdAt.toUTCString(),
                            'update_date': post.updatedAt.toUTCString(),
                            'num_comments': 0
                        });
                    });
                });
            });
        }
        
        return this;
    };
    
    return Post;
})();