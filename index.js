var spawn = require('child_process').spawn;
var _ = require('underscore');
var fs = require("fs");
var sys = require('sys')
var exec = require('child_process').exec;

var CONFIG = require("./config");

if (CONFIG.coordinates) {
    var year = [];
    var Now = getDateTime(true);

    var dayCount = 0;
    var week;

    var date = {
        year: Now.year - 1,
        month: Now.month - 1,
        day: Now.day,
        cDay: Now.cDay - 1
    };

    if (date.cDay) {
        week = [];
        for (var i = 0; i < date.cDay; ++i) {
            week.push({});
        }
    }

    for (var i = 0; i < 366; ++i) {
        // console.log("> Date: ", date, "DAYS IN MONTH: ", new Date(date.year, date.month, 0).getDate());
        if (date.day > new Date(date.year, date.month, 0).getDate()) {
            date.day = 1;
            ++date.month;
            if (date.month > 12) {
                date.month = 1;
                ++date.year;
            }
        }

        if (week && week.length === 7) {
            year.push(week);
            week = [];
        }
        if (!week) {
            week = [];
        }

        var dateStr = date.year + "-" + date.month + "-" + date.day;
        console.log(" * " + dateStr);
        week.push({
            date: (new Date(date.year, date.month, date.day).getTime() / 1000)
        });
        ++date.day;
    }

    fs.writeFile("./test.json", JSON.stringify(year, null, 4));

    CONFIG.dates = [];
    for (var point in CONFIG.coordinates) {
        var p = CONFIG.coordinates[point];
        CONFIG.dates.push(year[p.x - 1][p.y - 1].date);
    }
    console.log(CONFIG.dates);
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

    console.log("> " + command);

    // executes `pwd`
    var child = exec(command, function (error, stdout, stderr) {
        sys.print('stdout: ' + stdout);
        sys.print('stderr: ' + stderr);
        if (error !== null) {
            console.log('exec error: ' + error);
        }
    }).on("close", function (code) {
        console.log("Close: " + code);
        callback ? callback() : "";
    });
}

function getDateTime(obj) {

    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

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
