//  Screenshot Backend
//  Application entry point

var config = require("./config.json");

var uploader = require("./uploader");
var mime = require("mime");
var express = require("express");
var morgan = require("morgan");
var bodyParser = require("body-parser");

// Multer
var multer  = require("multer");
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "uploads");
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + "-" + Date.now() + "." + mime.extension(file.mimetype));
    }
});
var upload = multer({ storage: storage });

// Express app
var app = express();

// Express middleware
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));

// Routes
app.get("/", function(req, res) {
    res.send("screenshot-backend");
});

app.post("/upload", upload.single("screenshot"), function(req, res) {
    uploader.save(req, function(response) {
        res.send(response);
    });
});

// Express server
app.listen(config.port, function() {
    console.log("App listening on port " + config.port);
});
