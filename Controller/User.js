// postShuffle -- web forum software for node.js
// Copyright (c) 2012 Mooneer Salem

var ControllerBase = require("../Utility/ControllerBase");
var util           = require("util");
var DataModel      = require("../DataModel");
var AppConfig      = require('../AppConfig.js');

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
        this.__app.get("/user/logout", this.logout);
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
     * Registers a new user.
     * @param {Object} json_args Dictionary of arguments (username, password, email).
     * @param {Object} session_data Session data.
     * @param {Object} query_args Query string arguments.
     * @param {Object} params List of URL parameters.
     * @returns {Array} Data corresponding to the logged in user.
     */
    User.prototype.register = function(json_args, session_data, query_args, params) {
        var self = this;
        
        if (session_data.user)
        {
            self.emitFailure("Cannot be logged in.");
        }
        else
        {
            if (!json_args.username || !json_args.password || !json_args.email)
            {
                self.emitFailure("Must provide username/password/email.");
            }
            else
            {
                // Generate unique confirmation code.
                var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                    return v.toString(16);
                });
                
                var config = new AppConfig();
                
                DataModel.Users.create({
                    username: json_args.username,
                    password: json_args.password,
                    is_moderator: false,
                    is_admin: false,
                    title: config.defaultTitle,
                    confirmation_code: uuid,
                    email: json_args.email
                }).success(function(u) {
                    // TODO: send confirmation email.
                    self.emitSuccess({});
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