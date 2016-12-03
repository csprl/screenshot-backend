//  Screenshot Backend
//  Image uploader code

var config = require("./config.json");
var users = require("./users.json");

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
    if (req.validupload == true) {
        next(config.domain + "/" + req.file.filename.replace("\\", "/"));
    }
    else {
        next("fail");
    }
}

exports.fileFilter = function(req, file, cb) {
    checkCredentials(req.body.username, req.body.password, function(status, dirs) {
        if (status) {
            req.validupload = false;
            cb(null, false);
        }
        else {
            //console.log(file);
            req.dirs = dirs;
            req.validupload = true;
            cb(null, true);
        }
    });
}
