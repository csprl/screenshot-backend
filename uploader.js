//  Screenshot Backend
//  Image uploader code

var config = require("./config.json");
var auth = require("./auth.json");

var path = require("path");
var mime = require("mime");
var randomstring = require("randomstring");

function checkCredentials(creds, done) {
    if ((typeof creds.username !== 'undefined' && creds.username) && (typeof creds.password !== 'undefined' && creds.password)) {
        usersLeft = auth.users.length;
        for (i in auth.users) {
            if (auth.users[i].username == creds.username) {
                if (auth.users[i].password == creds.password) {
                    return done(null, auth.users[i].dirs);
                }
                else {
                    return done("wrong password", null);
                }
            }

            if (--usersLeft === 0) { // If list is empty, and we haven't reported a success/bad password, return with user not found
                return done("no such username", null);
            }
        }
    }
    else if (config.gyazoenabled && (typeof creds.key !== "undefined" && creds.key)) {
        keysLeft = auth.keys.length;
        for (i in auth.keys) {
            if (auth.keys[i].key == creds.key) {
                dir = auth.keys[i].uploaddir;
                return done(null, {"images": dir, "videos": dir, "files": dir});
            }

            if (--keysLeft === 0) { // If list is empty, and we haven't reported a success/bad password, return with user not found
                return done("no such key", null);
            }
        }
    }
    else {
        done("unknown error", null)
    }
}

exports.save = function(req, next) {
    if (req.validupload) {
        next(config.domain + "/" + req.file.filename.replace("\\", "/"));
    }
    else {
        next(config.domain);
    }
}

exports.multerStorage = {
    destination: function(req, file, cb) {
        cb(null, config.uploaddir);
    },
    filename: function(req, file, cb) {
        if (file.mimetype.indexOf("image/") > -1) {
            dir = req.dirs.images;
        }
        else if (file.mimetype.indexOf("video/") > -1) {
            dir = req.dirs.videos;
        }
        else {
            dir = req.dirs.files;
        }
        cb(null, dir + path.sep + randomstring.generate({"length": 4, "capitalization": "lowercase"}) + "." + mime.extension(file.mimetype));
    }
}

exports.fileFilter = function(req, file, cb) {
    checkCredentials({"username": req.body.username, "password": req.body.password, "key": req.params.key}, function(status, dirs) {
        if (status) {
            cb(null, false);
        }
        else {
            if (config.allowedmimetypes.indexOf(file.mimetype) === -1) {
                return cb(null, false);
            }

            req.dirs = dirs;
            req.validupload = true;
            cb(null, true);
        }
    });
}
