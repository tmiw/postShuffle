// postShuffle -- web forum software for node.js
// Copyright (c) 2012 Mooneer Salem

var AppConfig = require('./AppConfig');
var Sequelize = require('sequelize');

var db = new Sequelize(AppConfig.Database.name, AppConfig.Database.username, AppConfig.Database.password, {
    'dialect': AppConfig.Database.type,
    'storage': AppConfig.Database.name + ".db"
});

// Tables.
exports.Users = db.define('User', {
    'username': Sequelize.STRING,
    'password': Sequelize.STRING,
    'is_moderator': Sequelize.BOOLEAN,
    'is_admin': Sequelize.BOOLEAN,
    'title': Sequelize.STRING,
    'confirmation_code': Sequelize.STRING,
    'email': Sequelize.STRING
});

exports.Posts = db.define('Post', {
    'title': Sequelize.STRING,
    'body': Sequelize.TEXT
});

exports.Tags = db.define('Tag', {
    'tag': Sequelize.STRING
});

exports.Comments = db.define('Comment', {
    'body': Sequelize.TEXT
});

// Associations.
exports.Users.hasMany(exports.Comments);
exports.Users.hasMany(exports.Posts);
exports.Posts.hasMany(exports.Tags);
exports.Posts.hasMany(exports.Comments);
exports.Posts.belongsTo(exports.Users);
exports.Tags.hasMany(exports.Posts);
exports.Comments.hasOne(exports.Comments, {'as': 'Parent'});
exports.Comments.belongsTo(exports.Users);

var Passwords = require(__dirname + "/Utility/Passwords.js");
var generator = require(__dirname + "/Utility/RandomGenerators.js");
db.sync().success(function() {
    exports.Users.findAll({limit: 1}).success(function(result) {
        if (!result || result.length === 0)
        {
            // first run.
            var newpw = generator.randomString();
            exports.Users.create({
                username: "admin",
                password: Passwords.hash(newpw),
                is_moderator: true,
                is_admin: true,
                title: AppConfig.defaultTitle,
                email: AppConfig.admin_email
            }).success(function(u) {
                console.log("============= FIRST RUN  =============");
                console.log("Your admin user is as follows:");
                console.log("   Username: admin");
                console.log("   Password: " + newpw);
                console.log("KEEP THIS INFO IN A SAFE PLACE OR YOU WILL BE UNABLE TO ADMINISTER YOUR FORUM.");
                console.log("============= /FIRST RUN =============");
            }).error(function(err) {
                console.log("Cannot access database: " + err);
            });
        }
    });
});