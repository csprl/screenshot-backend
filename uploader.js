//  Screenshot Backend
//  Image uploader code

var users = require("./users.json");

function checkCredentials(username, password, done) {
    usersLeft = users.users.length;
    for (i in users.users) {
        if (users.users[i].username == username) {
            if (users.users[i].password == password) {
                return done(null);
            }
            else {
                return done("wrong password");
            }
        }

        if (--usersLeft === 0) { // If list is empty, and we haven't reported a success/bad password, return with user not found
            return done("no such username");
        }
    }
}

exports.save = function(req, next) {
    checkCredentials(req.body.username, req.body.password, function(status) {
        if (status) {
            return next(status);
        }
        else { // Should move this out from the checkCredentials() function
            //console.log(req.file);
            next("success");
        }
    });
}
