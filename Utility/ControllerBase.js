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
        ControllerBase.super_.call(this);
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
        this.once('success', fxn);
        return this;
    };
    
    /**
     * Provides a failure event handler to controller.
     * @param {Function} fxn The function to execute.
     */
    ControllerBase.prototype.failure = function(fxn) {
        this.once('failure', fxn);
        return this;
    };
    
    /**
     * Wraps JSON handling around the given action.
     * @param {Function} fn The function to call.
     */
    ControllerBase.prototype.json = function(fn) {
        var self = this;
        
        return function(req, res) {
            // TBD: should wrap returned data and/or perform preprocessing
            // of input JSON.
            var fail_f = function(err) {
                self.removeListener('success', success_f);
                res.send({
                    'status': 'fail',
                    'error': err
                });
            };
            
            var success_f = function(data) { 
                self.removeListener('failure', fail_f);
                res.send({
                    'status': 'ok',
                    'result': data
                }); 
            };
                
            try
            {
                self.failure(fail_f);
                fn.call(self, req.body, req.session, req.query, req.params).success(success_f);
            } 
            catch (err) 
            {
                self.emitFailure("Internal error.");
            }
        };
    };
    
    /**
     * Wraps HTML handling around the given action.
     * @param {Function} fn The function to call.
     * @param {String} template The name of the template to use.
     * @param {String} title The page's title.
     */
    ControllerBase.prototype.html = function(fn, template, title) {
        var self = this;
        
        return function(req, res) {
            fn.call(self, {}, req.session, req.query, req.params).success(function(data) { 
                res.render(template, {
                    'title': title,
                    'user_data': JSON.stringify(req.session.user),
                    'data': JSON.stringify(data)
                });
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
    
    /**
     * Emits a failure event given result data.
     * @param {Object} data The data to pass to the event handler.
     */
    ControllerBase.prototype.emitFailure = function(data) {
        this.emit('failure', data);
    };
    
    return ControllerBase;
})();

