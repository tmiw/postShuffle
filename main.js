// postShuffle -- web forum software for node.js
// Copyright (c) 2012 Mooneer Salem

var express = require('express');
var app = express();
var Controller = require(__dirname + '/Controller');
var AppConfig = require('./AppConfig.js');
var consolidate = require('consolidate');

// Initialize Express middleware.
app.use(express.compress());
app.use(express.bodyParser());
app.use(express.cookieParser(AppConfig.sessionSecret));
app.use(express.session());
app.use('/static', express.directory(__dirname + '/static'));
app.use('/static', express.static(__dirname + '/static'));

// Triggers initialization of database.
var database = require(__dirname + '/DataModel');

// Initialize controller.
var controller = new Controller(app);
controller.link_routes();

// Initialize template engine.
app.engine('html', consolidate.mustache);
app.set('view engine', 'html');
app.set('views', __dirname + '/templates');

// If we're being run for the first time, create an admin user with
// a random password. Echo this to the console.
var Passwords = require(__dirname + "/Utility/Passwords.js");
var generator = require(__dirname + "/Utility/RandomGenerators.js");
database.Users.findAll({limit: 1}).success(function(result) {
    if (!result || result.length === 0)
    {
        // first run.
        var newpw = generator.randomString();
        database.Users.create({
            username: "admin",
            password: Passwords.hash(newpw),
            is_moderator: true,
            is_admin: true,
            title: AppConfig.defaultTitle,
            email: AppConfig.admin_email
        }).success(function(u) {
            console.log("============= FIRST RUN  =============");
            console.log("Your admin user is as follows:");
            console.log("   Username: admin");
            console.log("   Password: " + newpw);
            console.log("KEEP THIS INFO IN A SAFE PLACE OR YOU WILL BE UNABLE TO ADMINISTER YOUR FORUM.");
            console.log("============= /FIRST RUN =============");

            // Begin listening for connections.
            app.listen(process.env.PORT);
        }).error(function(err) {
            console.log("Cannot access database: " + err);
        });
    }
    else
    {
        // not first run.
        
        // Begin listening for connections.
        app.listen(process.env.PORT);
    }
}).error(function(err) {
    console.log("Cannot access database: " + err);
});