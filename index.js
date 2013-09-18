var spawn = require('child_process').spawn;
var _ = require('underscore');
var fs = require("fs");
var sys = require('sys')
var exec = require('child_process').exec;

// create repository
runCommand("sh " + __dirname + "/bin/create-repository.sh " + process.cwd(), function () {
    runCommand("sh " + __dirname + "/bin/create-commit.sh " + process.cwd() + "/generated-repo" + " 1379443078");
});

for (var i = 1379443078; i < 1347840000; i += 24*60*60) {
    console.log(i);
    runSh("create-commit.sh", [process.cwd() + "/generated-repo", ]);
}

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
    });;
}
