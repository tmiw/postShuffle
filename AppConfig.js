// postShuffle -- web forum software for node.js
// Copyright (c) 2012 Mooneer Salem

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
};

module.exports = settings;