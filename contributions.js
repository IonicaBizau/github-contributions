var spawn = require('child_process').spawn;
var _ = require('underscore');
var fs = require("fs");
var sys = require('sys');
var exec = require('child_process').exec;
var colors = require('colors'); // https://github.com/Marak/colors.js

module.exports = {
    getRepo: function (options, callback) {
        if (!options.coordinates) {
            return callback("Missing coordinates key of options.");
        }

        if (options.coordinates.constructor !== Array) {
            return callback("Invalid coordinates field value. It must be an array.");
        }

        _.defaults(options, {
            "time": {
                "hour": 10
            }
        });

        var year = [];
        var Now = getDateTime(true);

        var dayCount = 0;
        var week = [];

        var date = {
            year: Now.year - 1,
            month: Now.month - 1,
            day: Now.day,
            cDay: Now.cDay - 1,
            hour: options.time.hour
        };

        var dateObj = new Date(date.year, date.month, date.day, date.hour);

        for (var i = 0; i < 366; ++i) {
            var unixStamp = dateObj.getTime() / 1000;

            week[dateObj.getDay()] = {
                date: unixStamp
            };
            if (dateObj.getDay() === 6) {
                year.push(week);
                week = [];
            }

            dateObj.setDate(dateObj.getDate() + 1);
        }
        if (week.length > 0) {
            year.push(week);
        }

        fs.writeFile("./test.json", JSON.stringify(year, null, 4));

        options.dates = [];
        for (var point in options.coordinates) {
            var p = options.coordinates[point];
            options.dates.push(year[p.x - 1][p.y - 1].date);
        }

        // print dates
        for (var i = 0; i < options.dates.length; i++) {
            console.log(new Date(options.dates[i] * 1000));
        }

        var repoName = Math.random().toString(36).substring(3);
        runCommand("sh " + __dirname + "/bin/create-repository.sh " + process.cwd() + " " + repoName, function () {
            console.log("Created");
            var ID = 0;
            (function makeCommit (date) {
                if (!date || isNaN(date)) {
                    console.log("Date is: ", date, "ID: ", ID);
                    callback(null, "[TODO generated repo URL]");
                    //process.exit(1); ???
                    return;
                }
                runCommand("sh " + __dirname + "/bin/create-commit.sh " + process.cwd() + "/" + repoName + " " + date, function () {
                    var commitsPerDay = options.commitsPerDay;

                    var i = 0;
                    (function makeDayCommit () {
                        console.log(i + " < " + commitsPerDay);
                        if (++i > commitsPerDay) {
                            if (ID >= options.dates.length) {
                                console.log("FINISHED");
                                callback(null, "[TODO generated repo URL]");
                                //process.exit(0); ???
                            }
                            if (ID < options.dates.length) {
                                makeCommit(options.dates[++ID]);
                                return;
                            }
                        }

                        runCommand("sh " + __dirname + "/bin/create-commit.sh " + process.cwd() + "/" + repoName + " " + (date + i * 60), function () {
                            makeDayCommit();
                        });
                    })()
                });
            })(options.dates[ID]);
        });
    }
};

function runCommand (command, callback) {

    console.log("> " + command.bold);

    // executes `pwd`
    var child = exec(command, function (error, stdout, stderr) {
        sys.print('stdout: ' + stdout);
        sys.print('stderr: ' + stderr.red);
        if (error !== null) {
            console.log('exec error: '.red.bold + error.bold);
        }
    }).on("close", function (code) {
        console.log("Close: ".bold + code);
        callback ? callback() : "";
    });
}

function padWithZero(x) {
    return (x < 10 ? "0" : "") + x;
}

function getDateTime(obj) {

    var date = new Date();

    var hour = date.getHours();
    hour = padWithZero(hour);

    var min  = date.getMinutes();
    min = padWithZero(min);

    var sec  = date.getSeconds();
    sec = padWithZero(sec);

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = padWithZero(month);

    var day  = date.getDate();
    day = padWithZero(day);

    if (obj) {
        return {
            year: year,
            month: parseInt(month),
            day: parseInt(day),
            cDay: date.getDay()
        }
    }
    return year + "-" + month + "-" + day;
}
