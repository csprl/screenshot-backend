//  Screenshot Backend
//  Image uploader code

var config = require("./config.json");
var users = require("./users.json");

var mime = require("mime");
var randomstring = require("randomstring");

function checkCredentials(username, password, done) {
    usersLeft = users.users.length;
    for (i in users.users) {
        if (users.users[i].username == username) {
            if (users.users[i].password == password) {
                return done(null, users.users[i].dirs);
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

exports.save = function(req, next) {
    if (req.validupload) {
        next(config.domain + "/" + req.file.filename.replace("\\", "/"));
    }
    else {
        next("fail");
    }
}

exports.multerStorage = {
    destination: function(req, file, cb) {
        cb(null, "uploads");
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
        cb(null, dir + "\\" + randomstring.generate({"length": 4, "capitalization": "lowercase"}) + "." + mime.extension(file.mimetype));
    }
}

exports.fileFilter = function(req, file, cb) {
    checkCredentials(req.body.username, req.body.password, function(status, dirs) {
        if (status) {
            cb(null, false);
        }
        else {
            //console.log(file);

            if (config.allowedmimetypes.indexOf(file.mimetype) === -1) {
                return cb(null, false);
            }

            req.dirs = dirs;
            req.validupload = true;
            cb(null, true);
        }
    });
}
