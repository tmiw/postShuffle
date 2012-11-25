// postShuffle -- web forum software for node.js
// Copyright (c) 2012 Mooneer Salem

/**
 * Generates a random string of characters.
 * @param {Integer} length Length of string.
 * @returns {String} Random string.
 */
module.exports.randomString = function(length) {
    var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
    var string_length = length || 8;
    var randomstring = '';
    for (var i=0; i<string_length; i++) {
        var rnum = Math.floor(Math.random() * chars.length);
        randomstring += chars.substring(rnum,rnum+1);
    }
    return randomstring;
};

/**
 * Generates a UUID.
 * @returns {String} UUID.
 */
module.exports.uuid = function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
};