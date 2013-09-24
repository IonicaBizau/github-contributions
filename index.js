var spawn = require('child_process').spawn;
var _ = require('underscore');
var fs = require("fs");
var sys = require('sys');
var exec = require('child_process').exec;
var colors = require('colors'); // https://github.com/Marak/colors.js

var CONFIG;
if (process.argv.length <= 2) {
    CONFIG = require("./config");
} else {
    CONFIG = require("./" + process.argv[2]);
}

_.defaults(CONFIG, {
    "time": {
        "hour": 10
    }
});

if (CONFIG.coordinates) {
    var year = [];
    var Now = getDateTime(true);

    var dayCount = 0;
    var week;

    var date = {
        year: Now.year - 1,
        month: Now.month - 1,
        day: Now.day,
        cDay: Now.cDay - 1,
        hour: CONFIG.time.hour
    };

    if (date.cDay) {
        week = [];
        for (var i = 0; i < date.cDay; ++i) {
            week.push({});
        }
    }

    var dateObj = new Date(date.year, date.month, date.day, date.hour);

    for (var i = 0; i < 366; ++i) {

        if (week && week.length === 7) {
            year.push(week);
            week = [];
        }
        if (!week) {
            week = [];
        }


        var unixStamp = dateObj.getTime() / 1000;

        if (unixStamp === 1349074800) {
            console.log(date);
        }

        week.push({
            date: unixStamp
        });

        dateObj.setDate(dateObj.getDate() + 1);
    }

    fs.writeFile("./test.json", JSON.stringify(year, null, 4));

    CONFIG.dates = [];
    for (var point in CONFIG.coordinates) {
        var p = CONFIG.coordinates[point];
        CONFIG.dates.push(year[p.x - 1][p.y - 1].date);
    }

    // print dates
    for (var i = 0; i < CONFIG.dates.length; i++) {
        console.log(new Date(CONFIG.dates[i] * 1000));
    }
}

if (CONFIG.dates) {
    runCommand("sh " + __dirname + "/bin/create-repository.sh " + process.cwd(), function () {
        console.log("Created");
        var ID = 0;
        (function makeCommit (date) {
            if (!date || isNaN(date)) {
                console.log("Date is: ", date, "Id: ", ID);
                process.exit(1);
                return;
            }
            runCommand("sh " + __dirname + "/bin/create-commit.sh " + process.cwd() + "/generated-repo" + " " + date, function () {
                var commitsPerDay = CONFIG.commitsPerDay;

                var i = 0;
                (function makeDayCommit () {
                    console.log(i + " < " + commitsPerDay);
                    if (++i > commitsPerDay) {
                        if (ID >= CONFIG.dates.length) {
                            console.log("FINISHED");
                            process.exit(0);
                        }
                        if (ID < CONFIG.dates.length) {
                            makeCommit(CONFIG.dates[++ID]);
                            return;
                        }
                    }

                    runCommand("sh " + __dirname + "/bin/create-commit.sh " + process.cwd() + "/generated-repo" + " " + (date + i * 60), function () {
                        makeDayCommit();
                    });
                })()
            });
        })(CONFIG.dates[ID]);
    });
    return;
}
// create repository
runCommand("sh " + __dirname + "/bin/create-repository.sh " + process.cwd(), function () {
    runCommand("sh " + __dirname + "/bin/create-commit.sh " + process.cwd() + "/generated-repo" + " 1379443078");

    var beginDate = Date.parse(CONFIG.beginDate) / 1000 || Date.parse("2012-09-14") / 1000;
    var endDate =   Date.parse(CONFIG.endDate) / 1000 || Date.parse("2013-09-14") / 1000;

    var commitCount = 1;
    (function makeCommit (date) {
        ++commitCount;
        runCommand("sh " + __dirname + "/bin/create-commit.sh " + process.cwd() + "/generated-repo" + " " + date, function () {
            var commitsPerDay = Math.floor(Math.random() * CONFIG.maxCommitsPerDay || 10);
            commitCount += commitsPerDay;
            var i = 0;

            (function makeDayCommit () {
                console.log(i + " < " + commitsPerDay);
                if (++i > commitsPerDay) {
                    if (date >= endDate) {
                        console.log(">> Commits: " + commitCount);
                        process.exit(0);
                    }
                    if (date < endDate) {
                        console.log(date + " < " + endDate);
                        makeCommit(date + 24 * 60 * 60);
                        return;
                    }
                }

                runCommand("sh " + __dirname + "/bin/create-commit.sh " + process.cwd() + "/generated-repo" + " " + (date + i * 60), function () {
                    makeDayCommit();
                });
            })()
        });
    })(beginDate);
});

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
