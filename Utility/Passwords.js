// postShuffle -- web forum software for node.js
// Copyright (c) 2012 Mooneer Salem

var crypto = require('crypto');

/**
 * Hashes password.
 * @param {String} password Password to hash.
 * @returns {String} Hashed password in base64 encoding.
 */
module.exports.hash = function(password) {
    var hasher = crypto.createHash('sha256');
    hasher.update(password, 'utf8');
    return hasher.digest('base64');
};