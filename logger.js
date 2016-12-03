//  Screenshot Backend
//  Application logger

var winston = require("winston");

module.exports = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({ level: "debug", colorize: "all" }),
        new (winston.transports.File)({ filename: "logs/app.log" })
    ]
});
