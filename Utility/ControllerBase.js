// postShuffle -- web forum software for node.js
// Copyright (c) 2012 Mooneer Salem

var   util   = require("util")
    , events = require("events");

/**
 * Creates new Controller object.
 * @param {Object} app Express app object.
 * @return {Object} The new object.
 */
var ControllerBase = function(app) {
    events.EventEmitter.call(this);
    this.__app = app;
};

// Inherits EventEmitter for event handling.
util.inherits(ControllerBase, events.EventEmitter);

/**
 * Links controller's routes to application.
 */
ControllerBase.prototype.link_routes = function() {
    throw "not implemented";
};

module.exports = ControllerBase;