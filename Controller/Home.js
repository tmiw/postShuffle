// postShuffle -- web forum software for node.js
// Copyright (c) 2012 Mooneer Salem

var show_without_name = function(req, res) {
    res.send("hai");
};

var show_with_name = function(req, res) {
    res.send("hai " + req.params["name"]);
};

exports.Home = function(app) {
    app.get("/", show_without_name);
    app.get("/:name", show_with_name);
};