//  Screenshot Backend
//  Application entry point

var config = require("./config.json");
var express = require("express");
var morgan = require("morgan");
var app = express();

app.use(morgan("dev"));

app.get("/", function (req, res) {
    res.send("screenshot-backend");
});

app.post("/upload", function (req, res) {
    res.send("Work in progress");
});

app.listen(config.port, function () {
    console.log("App listening on port " + config.port);
});
