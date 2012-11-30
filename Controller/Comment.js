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
    var Comment = function(app) {
        Comment.super_.call(this, app);
    };
    
    util.inherits(Comment, ControllerBase);
    
    /**
     * Links controller's routes to application.
     */
    Comment.prototype.link_routes = function() {   
        this.__app.delete("/comment/:pid/:cid", this.json(this.delete_comment));
        this.__app.put("/comment/:pid/:cid", this.json(this.edit_comment));
        this.__app.put("/comment/:cid", this.json(this.add_new_comment));
        this.__app.get("/comment/:cid", this.json(this.get_comments));
    };
    
    /**
     * Edits existing comment.
     * @param {Object} json_args Arguments passed in by browser.
     * @param {Object} session_data Current session data.
     * @param {Object} params URL parameters.
     * @returns {Array} Data corresponding to the new post.
     */
    Comment.prototype.edit_comment = function(json_args, session_data, query_args, params) {
        var self = this;
        var commentId = parseInt(params.cid, 10);
        var postId = parseInt(params.pid, 10);
        var error_f = function(err) {
            self.emitFailure(err);
        };
        
        if (!session_data.user)
        {
            error_f("Must log in to post.");
        }
        else if (!json_args.body)
        {
            error_f("Must specify new body for comment.");
        }
        else 
        {
            DataModel.Users.findAll({
                where: {
                    username: session_data.user.username
                }
            }).success(function(users) {
                var user = users[0];
                DataModel.Comments.find(commentId).success(function(comment) {
                    if (comment.UserId != user.id &&
                        !user.is_moderator &&
                        !user.is_admin)
                    {
                        error_f("Not enough permissions to delete comment.");
                    }
                    else
                    {
                        comment.body = json_args.body;
                        comment.save().success(function() {
                            self.emitSuccess({
                                'author': {
                                    'username': user.username,
                                    'title': user.title,
                                    'is_moderator': user.is_moderator,
                                    'is_admin': user.is_admin,
                                    'joined': user.createdAt
                                },
                                'body': comment.body,
                                'id': comment.id,
                                'create_date': comment.createdAt.toUTCString(),
                                'update_date': comment.updatedAt.toUTCString()
                            });
                        }).error(error_f);
                    }
                }).error(error_f);
            }).error(error_f);
        }
        
        return this;
    };
    
    /**
     * Deletes existing comment.
     * @param {Object} json_args Arguments passed in by browser.
     * @param {Object} session_data Current session data.
     * @param {Object} params URL parameters.
     * @returns {Array} Data corresponding to the new post.
     */
    Comment.prototype.delete_comment = function(json_args, session_data, query_args, params) {
        var self = this;
        var commentId = parseInt(params.cid, 10);
        var error_f = function(err) {
            self.emitFailure(err);
        };
        
        if (!session_data.user)
        {
            error_f("Must log in to post.");
        }
        else 
        {
            DataModel.Users.findAll({
                where: {
                    username: session_data.user.username
                }
            }).success(function(users) {
                var user = users[0];
                DataModel.Comments.find(commentId).success(function(comment) {
                    if (comment.UserId != user.id &&
                        !user.is_moderator &&
                        !user.is_admin)
                    {
                        error_f("Not enough permissions to delete comment.");
                    }
                    else
                    {
                        comment.destroy().success(function() {
                            self.emitSuccess({});
                        }).error(error_f);
                    }
                }).error(error_f);
            }).error(error_f);
        }
        
        return this;
    };
    
    /**
     * Adds a new comment.
     * @param {Object} json_args Dictionary of arguments (offset).
     * @param {Object} session_data Session data.
     * @param {Object} query_args Query string arguments.
     * @param {Object} params List of URL parameters (/comment/[post_id]).
     * @returns {Array} Data corresponding to the new comment.
     */
    Comment.prototype.add_new_comment = function(json_args, session_data, query_args, params) {
        var self = this;
        var post_id = parseInt(params.cid, 10);
        
        var error_f = function(err) {
            self.emitFailure(err);
        };
        
        if (!session_data.user)
        {
            error_f("Must log in to post.");
        }
        else if (!json_args.body || !post_id)
        {
            error_f("Must provide a body and post ID.");
        }
        else 
        {
            // TODO: find valid user.
            DataModel.Posts.find(post_id).success(function(post) {
                if (!post) 
                {
                    error_f("Could not find post " + post_id);
                }
                else
                {
                    DataModel.Users.findAll({
                        where: {
                            username: session_data.user.username
                        }
                    }).success(function(users) {
                        if (!users || users.length === 0) 
                        {
                            error_f("Invaid user.");
                        }
                        else
                        {
                            var user = users[0];
                            DataModel.Comments.create({
                                'body': json_args.body
                            }).success(function(comment) {
                                post.addComment(comment).success(function() {
                                    user.addComment(comment).success(function() {
                                        self.emitSuccess({
                                            'author': {
                                                'username': user.username,
                                                'title': user.title,
                                                'is_moderator': user.is_moderator,
                                                'is_admin': user.is_admin,
                                                'joined': user.createdAt
                                            },
                                            'body': comment.body,
                                            'id': comment.id,
                                            'create_date': comment.createdAt.toUTCString(),
                                            'update_date': comment.updatedAt.toUTCString()
                                        });
                                    }).error(error_f);
                                }).error(error_f);
                            }).error(error_f);
                        }
                    }).error(error_f);
                }
            }).error(error_f);
        }
        
        return this;
    };
    
    /**
     * Retrieves comments, given an offset.
     * @param {Object} json_args Dictionary of arguments (offset).
     * @param {Object} session_data Session data.
     * @param {Object} query_args Query string arguments.
     * @param {Object} params List of URL parameters (/comment/[post_id]).
     * @return {Array} The list of posts.
     */
    Comment.prototype.get_comments = function(json_args, session_data, query_args, params) {
        var self = this;
        var offset = json_args.offset || query_args.offset || 0;
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