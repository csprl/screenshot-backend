//  screenshot-backend
//  Express server and main code

const config = require("./config.json");
const users = require("./users.json");
const express = require("express");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const multer  = require("multer");
const path = require("path");
const fs = require("fs");
const mime = require("mime");
const randomstring = require("randomstring");

// Initialize Express and set up middleware
const app = express();
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: false }));

// Configure multer for file uploading
const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            let dir;
            if (typeof req._user.dirs === "string") {
                dir = req._user.dirs;
            }
            else if (typeof req._user.dirs === "object" && req._user.dirs[file.mimetype]) {
                dir = req._user.dirs[file.mimetype];
            }
            else {
                dir = "random";
            }
            dir = path.resolve(config.uploaddir, dir);

            if (!fs.existsSync(dir)) fs.mkdirSync(dir); // make sure directory exists, requires parent folder to exist
            cb(null, dir);
        },
        filename: (req, file, cb) => {
            cb(null, randomstring.generate({ "length": 4, "capitalization": "lowercase" }) + "." + mime.getExtension(file.mimetype));
        }
    }),
    fileFilter: (req, file, cb) => {
        cb(null, config.allowedmimetypes.includes(file.mimetype));
    },
    limits: {
        fileSize: 10000000 // 10MB
    }
});

// Authentication middleware
const authentication = (req, res, next) => {
    const token = req.get("Token");
    if (!token || !users[token]) return res.status(401).end();

    // Resolve and add user to request
    req._user = users[token];
    next();
}

// Routes
app.post("/", authentication, (req, res) => { // sharex upload
    upload.single("data")(req, res, err => {
        if (err) return res.status(500).end();

        res.send(config.baseurl + path.relative(path.resolve(config.uploaddir), req.file.path).replace(/\\/, "/"));
    });
});

// Start Express server
app.listen(config.port, () => {
    console.log(`App listening on port ${config.port}`);
});
