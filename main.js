//  Screenshot Backend
//  Application entry point

var express = require("express");
var app = express();

app.get("/", function (req, res) {
    res.send("screenshot-backend");
})

app.post("/upload", function (req, res) {
    res.send("Work in progress");
})

app.listen(3000, function () {
    console.log("App listening on port 3000!");
})
