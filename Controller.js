// postShuffle -- web forum software for node.js
// Copyright (c) 2012 Mooneer Salem

var homePageController = require(__dirname + "/Controller/Home.js");

exports.Controller = function(app) {
    this.Home = new homePageController.Home(app);
}