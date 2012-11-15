// postShuffle -- web forum software for node.js
// Copyright (c) 2012 Mooneer Salem

var ControllerBase = require("../Utility/ControllerBase");
var util           = require("util");
var DataModel      = require("../DataModel");
var Sequelize      = require('sequelize');

module.exports = (function() {
    /**
     * Creates new Controller object.
     * @param {Object} app Express app object.
     * @return {Object} The new object.
     */
    var Comment = function(app) {
        Comment.super_.call(this, app);
    };
    
    util.inherits(Comment, ControllerBase);
    
    /**
     * Links controller's routes to application.
     */
    Comment.prototype.link_routes = function() {        
        //this.__app.put("/post", this.json(this.add_new_post));
        this.__app.get("/comment/:cid", this.json(this.get_comments));
    };
    
    /**
     * Adds a new post.
     * @param {Object} json_args Arguments passed in by browser.
     * @param {Object} session_data Current session data.
     * @returns {Array} Data corresponding to the new post.
     */
    /*Post.prototype.add_new_post = function(json_args, session_data, query_args) {
        var self = this;
        var tags = json_args.tags || [];
        
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
                    DataModel.Tags.findAll({where: {'tag': tags}}).success(function(tagObjs) {
                        var chainer = new Sequelize.Utils.QueryChainer;
                        
                        // Add the tags that exist.
                        for (var i in tagObjs)
                        {
                            chainer.add(post.addTag(tagObjs[i]));
                        }
                        
                        // TODO: ...and add the tags that don't.
                        chainer.add(user.addPost(post));
                        chainer.runSerially({ skipOnError: true }).success(function() {
                            self.emitSuccess({
                                'tags': tags,
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
            });
        }
        
        return this;
    };*/
    
    /**
     * Retrieves comments, given an offset.
     * @param {Object} json_args Dictionary of arguments (offset).
     * @param {Object} session_data Session data.
     * @param {Object} params List of URL parameters (/comment/[post_id]).
     * @return {Array} The list of posts.
     */
    Comment.prototype.get_comments = function(json_args, session_data, query_args, params) {
        var self = this;
        var offset = json_args['offset'] || query_args['offset'] || 0;
        var post_id = params.cid;
        
        var query = {
            'offset': offset, 
            'limit': 5,
            'order': 'createdAt DESC',
            'where': {'PostId': post_id}
        };
        
        var failure_f = function(err) {
            self.emitFailure(err);
        };
        
        DataModel.Comments.findAll(query).success(function(comments) {
            var result = [];
            var success_f = function(u, idx) {
                result.push({
                    'author': {
                        'username': u.username,
                        'title': u.title,
                        'is_moderator': u.is_moderator,
                        'is_admin': u.is_admin,
                        'joined': u.createdAt
                    },
                    'body': comments[idx].body,
                    'id': comments[idx].id,
                    'create_date': comments[idx].createdAt.toUTCString(),
                    'update_date': comments[idx].updatedAt.toUTCString(),
                });
                
                if (idx + 1 < comments.length)
                {
                    comments[idx + 1].getUser().success(function(user) {
                        success_f(user, idx + 1);
                    }).failure(failure_f);
                }
                else
                {
                    self.emitSuccess({
                        'comments': result
                    });
                }
            };
            
            if (comments.length > 0)
            {
                comments[0].getUser().success(function(user) {
                    success_f(user, 0);
                }).failure(failure_f);
            }
            else
            {
                self.emitSuccess({
                    'comments': result
                });
            }
        }).failure(failure_f);
        
        return self;
    };
    
    return Comment;
})();