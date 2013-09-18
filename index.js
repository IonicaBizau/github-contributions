var spawn = require('child_process').spawn;
var _ = require('underscore');
var fs = require("fs");
var sys = require('sys')
var exec = require('child_process').exec;

var CONFIG = require("./config");

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
