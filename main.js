//  Screenshot Backend
//  Application entry point

var config = require("./config.json");

var uploader = require("./uploader");
var express = require("express");
var morgan = require("morgan");
var bodyParser = require("body-parser");

// Multer
var multer  = require("multer");
var upload = multer({ storage: multer.diskStorage(uploader.multerStorage), fileFilter: uploader.fileFilter });

// Express app
var app = express();

// Express middleware
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));

// Routes
app.get("/", function(req, res) {
    res.send("screenshot-backend");
});

app.post("/upload", upload.single("file"), function(req, res) { // sharex upload
    uploader.save(req, function(response) {
        res.send(response);
    });
});

app.post("/upload/:key", upload.single("file"), function(req, res) { // gyazowin upload
    uploader.save(req, function(response) {
        res.send(response);
    });
});

// Express server
app.listen(config.port, function() {
    console.log("App listening on port " + config.port);
});
