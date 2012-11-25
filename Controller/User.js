// postShuffle -- web forum software for node.js
// Copyright (c) 2012 Mooneer Salem

var ControllerBase = require("../Utility/ControllerBase");
var util           = require("util");
var DataModel      = require("../DataModel");
var AppConfig      = require('../AppConfig.js');
var consolidate    = require('consolidate');

module.exports = (function() {
    /**
     * Creates new Controller object.
     * @param {Object} app Express app object.
     * @return {Object} The new object.
     */
    var User = function(app) {
        User.super_.call(this, app);
    };
    
    util.inherits(User, ControllerBase);
    
    /**
     * Links controller's routes to application.
     */
    User.prototype.link_routes = function() {        
        this.__app.get("/user/login", this.json(this.login));
        this.__app.post("/user/register", this.json(this.register));
        this.__app.post("/user/reset_password", this.json(this.reset_password));
        this.__app.get("/user/logout", this.logout);
        this.__app.get(/^\/user\/confirm\/([A-Fa-f0-9\-]+)$/, this.confirm_register);
    };
    
    /**
     * Confirms user registration.
     * @param {Object} req Request object.
     * @param {Object} res Response object.
     */
    User.prototype.confirm_register = function(req, res) {
        var uuid = req.params[0];
        var fail_f = function(err) {
            res.send(500);
        };
        
        DataModel.Users.findAll({
            where: {
                confirmation_code: uuid
            }}).success(function(u_list) {
                if (!u_list || u_list.length !== 1)
                {
                    res.send(404);
                }
                else
                {
                    var user = u_list[0];
                    user.confirmation_code = '';
                    user.save().success(function() {
                        req.session.user = {
                            'username': user.username,
                            'title': user.title,
                            'is_moderator': user.is_moderator,
                            'is_admin': user.is_admin,
                            'joined': user.createdAt
                        };
                        res.redirect("/");
                    }).error(fail_f);
                }
            }).error(fail_f);
    };
    
    /**
     * Logs user out of system.
     * @param {Object} req Request object.
     * @param {Object} res Response object.
     */
    User.prototype.logout = function(req, res) {
        // We're not using .json() here due to the success handler
        // not being attached soon enough.
        req.session.user = null;
        res.send({ 'status': 'ok' });
    };
    
    /**
     * Resets user's password.
     * @param {Object} json_args Dictionary of arguments (username).
     * @param {Object} session_data Session data.
     * @param {Object} query_args Query string arguments.
     * @param {Object} params List of URL parameters.
     * @returns {Array} Data corresponding to the logged in user.
     */
    User.prototype.reset_password = function(json_args, session_data, query_args, params) {
        var self = this;
        
        var randomString = function() {
            var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
            var string_length = 8;
            var randomstring = '';
            for (var i=0; i<string_length; i++) {
                var rnum = Math.floor(Math.random() * chars.length);
                randomstring += chars.substring(rnum,rnum+1);
            }
            return randomstring;
        };

        var username = json_args.username || query_args.username;
        if (!username)
        {
            self.emitFailure("Must provide username.");
        }
        else
        {
            DataModel.Users.findAll({
                where: {
                    username: username
                }
            }).success(function(u_list) {
                if (!u_list || u_list.length === 0)
                {
                    self.emitFailure("Cannot find user.");
                }
                else
                {
                    // Reset password.
                    var user = u_list[0];
                    var oldpw = user.password;
                    user.password = randomString();
                    user.save().success(function() {
                        consolidate.mustache(
                            __dirname + "/../templates/email/reset_password.html",
                            {
                                username: username,
                                new_password: user.password
                            },
                            function(err, html)
                            {
                                if (err)
                                {
                                    user.password = oldpw;
                                    user.save().success(function() {
                                        self.emitFailure(err);
                                    }).error(function(e) {
                                        self.emitFailure(e);
                                    });
                                }
                                else
                                {
                                    AppConfig.mailer.sendMail({
                                        from: AppConfig.mail_from,
                                        to: user.email,
                                        subject: AppConfig.mail_subjects.password_reset,
                                        html: html,
                                        generateTextFromHTML: true
                                    }, function(err, res) {
                                        if (err)
                                        {
                                            user.password = oldpw;
                                            user.save().success(function() {
                                                self.emitFailure(err);
                                            }).error(function(e) {
                                                self.emitFailure(e);
                                            });
                                        }
                                        else
                                        {
                                            self.emitSuccess({});
                                        }
                                    });
                                }
                            });
                    }).error(function(err) {
                        self.emitFailure(err);
                    });
                }
            }).error(function(err) {
                self.emitFailure(err);
            });
        }
        
        return self;
    };
    
    /**
     * Registers a new user.
     * @param {Object} json_args Dictionary of arguments (username, password, email).
     * @param {Object} session_data Session data.
     * @param {Object} query_args Query string arguments.
     * @param {Object} params List of URL parameters.
     * @returns {Array} Data corresponding to the logged in user.
     */
    User.prototype.register = function(json_args, session_data, query_args, params) {
        var self = this;
        
        var username = json_args.username || query_args.username;
        var password = json_args.password || query_args.password;
        var email = json_args.email || query_args.email;
        
        if (session_data.user)
        {
            self.emitFailure("Cannot be logged in.");
        }
        else
        {
            if (!username || !password || !email)
            {
                self.emitFailure("Must provide username/password/email.");
            }
            else
            {
                // TODO: ensure username/password have valid characters.
                
                // Verify that username does not already exist.
                DataModel.Users.findAll({
                    where: {
                        username: username
                    }
                }).success(function(u_list) {
                    if (u_list && u_list.length > 0)
                    {
                        self.emitFailure("Username already exists.");
                    }
                    else
                    {
                        // Generate unique confirmation code.
                        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                            return v.toString(16);
                        });
                        
                        DataModel.Users.create({
                            username: username,
                            password: password,
                            is_moderator: false,
                            is_admin: false,
                            title: AppConfig.defaultTitle,
                            confirmation_code: uuid,
                            email: email
                        }).success(function(u) {
                            // TODO: send confirmation email.
                            consolidate.mustache(
                                __dirname + "/../templates/email/register_confirm.html",
                                {
                                    username: username,
                                    confirm_code: uuid
                                },
                                function(err, html)
                                {
                                    if (err)
                                    {
                                        u.destroy().success(function() {
                                            self.emitFailure(err);
                                        }).error(function(err) {
                                            self.emitFailure(err);
                                        });
                                    }
                                    else
                                    {
                                        AppConfig.mailer.sendMail({
                                            from: AppConfig.mail_from,
                                            to: email,
                                            subject: AppConfig.mail_subjects.register_confirm,
                                            html: html,
                                            generateTextFromHTML: true
                                        }, function(err, res) {
                                            if (err)
                                            {
                                                u.destroy().success(function() {
                                                    self.emitFailure(err);
                                                }).error(function(err) {
                                                    self.emitFailure(err);
                                                });
                                            }
                                            else
                                            {
                                                self.emitSuccess({});
                                            }
                                        });
                                    }
                                });
                        }).error(function(err) {
                            self.emitFailure(err);
                        });
                    }
                }).error(function(err) {
                    self.emitFailure(err);
                });
            }
            
            return self;
        }
    };
    
    /**
     * Logs user into system.
     * @param {Object} json_args Dictionary of arguments.
     * @param {Object} session_data Session data.
     * @param {Object} query_args Query string arguments (username, password).
     * @param {Object} params List of URL parameters.
     * @returns {Array} Data corresponding to the logged in user.
     */
    User.prototype.login = function(json_args, session_data, query_args, params) {
        var self = this;
        
        var error_f = function(err) {
            self.emitFailure(err);
        };
        
        var username = query_args.username;
        var password = query_args.password;

        // TODO: SHA1/MD5 hashing of password
        DataModel.Users.findAll({
            where: {
                username: username,
                password: password
            }
        }).success(function(users) {
            if (!users || users.length === 0) 
            {
                error_f("Invalid username or password.");
            }
            else
            {
                var user = users[0];
                session_data.user = {
                                    'username': user.username,
                                    'title': user.title,
                                    'is_moderator': user.is_moderator,
                                    'is_admin': user.is_admin,
                                    'joined': user.createdAt
                                };
                self.emitSuccess(session_data.user);
            }
        }).error(error_f);
        
        return self;
    };
    
    return User;
})();