// postShuffle -- web forum software for node.js
// Copyright (c) 2012 Mooneer Salem

/**
 * Links controller's routes to application.
 */
var link_routes = function() {
    throw "not implemented";
};

/**
 * Creates new Controller object.
 * @param {Object} app Express app object.
 * @return {Object} The new object.
 */
module.exports = function(app) {
    this.__app = app;
    this.link_routes = link_routes;
};