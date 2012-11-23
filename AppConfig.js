// postShuffle -- web forum software for node.js
// Copyright (c) 2012 Mooneer Salem

var nodemailer = require("nodemailer");

var debugMode = true;

var settings = function() {
    if (debugMode)
    {
        this.Database = {
            'name': 'postshuffle',
            'type': 'sqlite',
            'username': '',
            'password': ''
        };
    }
    else
    {
        this.Database = {
            'name': 'postshuffle',
            'type': 'mysql',
            'username': 'postshuffle',
            'password': 'INSERT_PASSWORD_HERE'
        };
    }
    
    this.sessionSecret = "cookie monster";
    this.defaultTitle = "User";
    
    // Perform initialization here so that we have a mailer accessible from
    // anywhere in the project. See Nodemailer documentation for setup
    // instructions.
    this.mailer = nodemailer.createTransport("sendmail");
};

module.exports = new settings();