// postShuffle -- web forum software for node.js
// Copyright (c) 2012 Mooneer Salem

var util   = require("util");
var events = require("events");

/**
 * Creates new Controller object.
 * @param {Object} app Express app object.
 * @return {Object} The new object.
 */
module.exports = (function() {
    var ControllerBase = function(f) {
        events.EventEmitter.call(this);
        this.__app = f;
    };

    // Inherits EventEmitter for event handling.
    util.inherits(ControllerBase, events.EventEmitter);
      
    /**
     * Links controller's routes to application.
     */
    ControllerBase.prototype.link_routes = function() {
        throw "not implemented";
    };

    /**
     * Provides a success event handler to controller.
     * @param {Function} fxn The function to execute.
     */
    ControllerBase.prototype.success = function(fxn) {
        this.on('success', fxn);
        return this;
    };
    
    /**
     * Wraps JSON handling around the given action.
     * @param {Function} fn The function to call.
     */
    ControllerBase.prototype.json = function(fn) {
        return function(req, res) {
            // TBD: should wrap returned data and/or perform preprocessing
            // of input JSON.
            fn().success(function(data) { 
                res.send(data); 
            });
        };
    };
    
    /**
     * Emits a success event given result data.
     * @param {Object} data The data to pass to the event handler.
     */
    ControllerBase.prototype.emitSuccess = function(data) {
        this.emit('success', data);    
    };
    
    return ControllerBase;
})();

