//  Screenshot Backend
//  Standalone tool for checking and creating upload directories

var uploadfolder = "uploads";
var auth = require("./auth.json");

var fs = require("fs");
var path = require("path");

usersLeft = auth.users.length + auth.keys.length;
foldersCreated = 0;

if (!fs.existsSync(__dirname + path.sep + uploadfolder)) {
    fs.mkdirSync(__dirname + path.sep + uploadfolder);
}

for (i in auth.users) {
    if (!fs.existsSync(__dirname + path.sep + uploadfolder + path.sep + auth.users[i].dirs.images)) {
        foldersCreated++;
        fs.mkdirSync(__dirname + path.sep + uploadfolder + path.sep + auth.users[i].dirs.images);
    }

    if (!fs.existsSync(__dirname + path.sep + uploadfolder + path.sep + auth.users[i].dirs.videos)) {
        foldersCreated++;
        fs.mkdirSync(__dirname + path.sep + uploadfolder + path.sep + auth.users[i].dirs.videos);
    }

    if (!fs.existsSync(__dirname + path.sep + uploadfolder + path.sep + auth.users[i].dirs.files)) {
        foldersCreated++;
        fs.mkdirSync(__dirname + path.sep + uploadfolder + path.sep + auth.users[i].dirs.files);
    }

    if (--usersLeft === 0) { // If list is empty, and we haven't reported a success/bad password, return with user not found
        doneLooping();
    }
}

for (i in auth.keys) {
    if (!fs.existsSync(__dirname + path.sep + uploadfolder + path.sep + auth.keys[i].uploaddir)) {
        foldersCreated++;
        fs.mkdirSync(__dirname + path.sep + uploadfolder + path.sep + auth.keys[i].uploaddir);
    }

    if (--usersLeft === 0) { // If list is empty, and we haven't reported a success/bad password, return with user not found
        doneLooping();
    }
}

function doneLooping() {
    console.log("Done!\n" + foldersCreated + " folders created.\n" + (auth.users.length * 3 + auth.keys.length) + " folders scanned.");
}
