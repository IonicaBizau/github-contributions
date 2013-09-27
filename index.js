var spawn = require('child_process').spawn;
var _ = require('underscore');
var fs = require("fs");
var sys = require('sys');
var exec = require('child_process').exec;
var colors = require('colors'); // https://github.com/Marak/colors.js
var Contributions = require("./contributions");

var CONFIG;
if (process.argv.length <= 2) {
	CONFIG = require("./config");
} else {
	CONFIG = require("./" + process.argv[2]);
}

Contributions.getRepo(CONFIG, function (error, publicRepoUrl) {
	if (error !== null) {
		console.log(("Error: " + error).red);
		process.exit(1);
	}
	console.log("Repository successfully generated.");
	process.exit(0);
});