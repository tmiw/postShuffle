// postShuffle -- web forum software for node.js
// Copyright (c) 2012 Mooneer Salem

var nodemailer = require("nodemailer");
var htmlToText = require('nodemailer-html-to-text').htmlToText;

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
    this.mailer = nodemailer.createTransport({
        sendmail: true
    });
    this.mailer.use('compile', htmlToText());
    
    this.admin_email = "xyz@abc.def";
    this.mail_from = "postShuffle <xyz@abc.def>";
    this.mail_subjects = {
        register_confirm: 'Confirm your registration',
        password_reset: 'Password reset'
    };
};

module.exports = new settings();
