// dependencies
var spawn   = require('child_process').spawn
  , exec    = require('child_process').exec
  , fs      = require("fs")
  , sys     = require('sys')
  , colors  = require('colors')
  , _       = require('underscore')
  ;

/**
 *  Contributions object
 *
 */
module.exports = {

    /**
     *  Contributions.getRepo (options, callback)
     *  Generates a repository that will be compressend and its download link wil
     *  be send via callback
     *
     *  Arguments
     *    @options: object containing:
     *      - coordinates: an array of points. E.g.:
     *         [
     *             {x: 1, y: 2}
     *           , {x: 4, y: 1}
     *           ...
     *         ]
     *
     */
    getRepo: function (options, callback) {

        // coordinates
        if (!options.coordinates) {
            return callback("Missing coordinates key of options.");
        }

        // validate coordinates
        if (options.coordinates.constructor !== Array) {
            return callback("Invalid coordinates field value. It must be an array.");
        }

        // merge defaults
        _.defaults(options, {
            "time": {
                "hour": 10
            }
        });

        // initialize year array and the dateObj
        var year = []
          , Now = getDateTime(true)
          , dayCount = 0
          , week = []
          , date = {
                year: Now.year - 1,
                month: Now.month - 1,
                day: Now.day,
                cDay: Now.cDay - 1,
                hour: options.time.hour
            }
          , dateObj = new Date(date.year, date.month, date.day, date.hour)
          ;

        // each day in year
        for (var i = 0; i < 366; ++i) {

            // get the unix stamp
            var unixStamp = dateObj.getTime() / 1000;

            // set the unix stamp in the current day
            week[dateObj.getDay()] = {
                date: unixStamp
            };

            // we have a new week
            if (dateObj.getDay() === 6) {
                year.push(week);
                week = [];
            }

            // update the date
            dateObj.setDate(dateObj.getDate() + 1);
        }

        // push the last week
        if (week.length > 0) {
            year.push(week);
        }

        // initialize dates
        options.dates = [];

        // each point in coordinates
        for (var i = 0; i < options.coordinates.length; ++i) {

            // get the current point
            var cPoint = options.coordinates[i];

            // push the new date in the array
            options.dates.push(year[cPoint.x - 1][cPoint.y - 1].date);
        }

        // generate the repository path
        var repoName = "public/repos/" + Math.random().toString(36).substring(3);

        // init repository
        runCommand("sh " + __dirname + "/bin/create-repository.sh " + process.cwd() + " " + repoName, function () {

            // TODO handle error

            // the current commit
            var id = 0;

            // make commit
            (function makeCommit (date) {

                // we finished the generating
                if (!date || isNaN(date)) {

                    // compress the directory
                    runCommand("sh " + __dirname + "/bin/toZip.sh " + repoName, function (err) {

                        // handle error
                        if (err) { return callback(err); }

                        // send the final path (path to the zipped file)
                        callback(null, repoName + ".zip");
                    });
                    return;
                }

                // create commit
                runCommand("sh " + __dirname + "/bin/create-commit.sh " + process.cwd() + "/" + repoName + " " + date, function () {

                    // how many commits?
                    var commitsPerDay = options.commitsPerDay;

                    // current commit
                    var i = 0;

                    // make day commit
                    (function makeDayCommit () {

                        // output
                        console.log(i + " < " + commitsPerDay);

                        // finished?
                        if (++i > commitsPerDay) {

                            // finished
                            if (id >= options.dates.length) {
                                console.log("FINISHED");

                                // TODO Why callback?
                                callback(null, repoName);
                            }

                            // yep, go the the next day
                            if (id < options.dates.length) {
                                makeCommit(options.dates[++id]);
                                return;
                            }
                        }

                        // create commit
                        runCommand("sh " + __dirname + "/bin/create-commit.sh " + process.cwd() + "/" + repoName + " " + (date + i * 60), function () {
                            // TODO handle error

                            // try to make another commit this day
                            makeDayCommit();
                        });
                    })()
                });
            })(options.dates[id]);
        });
    }
};

/**
 *  This runs a bash command
 *
 */
function runCommand (command, callback) {

    // default value for callback
    callback = callback || function () {};

    // output
    console.log("> " + command.bold);

    // executes `pwd`
    var child = exec(command, function (error, stdout, stderr) {

        // output
        // sys.print('stdout: ' + stdout);
        // sys.print('stderr: ' + stderr.red);
        // we've got an error
        if (error !== null) {
            // output it
            // TODO Callback?
            console.log('exec error: '.red.bold + error.bold);
        }
    }).on("close", function (code) {

        // output
        console.log("Close: ".bold + code);

        // TODO err, data
        callback ();
    });
}

/**
 *  Adds `0` to stringified number if this is needed
 *
 */
function padWithZero(x) {
    return (x < 10 ? "0" : "") + x;
}

/**
 *  Returns the time in the moment when it's called
 *  If `obj` is true an object is returned
 *
 */
function getDateTime(obj) {

    // get date, hour, minute, second, year, month and day
    var date = new Date()
      , hour = date.getHours()
      , min  = date.getMinutes()
      , sec  = date.getSeconds()
      , year = date.getFullYear()
      , month = date.getMonth() + 1
      , day  = date.getDate()
      ;

    // add `0` if needed
    hour = padWithZero(hour);
    min = padWithZero(min);
    sec = padWithZero(sec);
    month = padWithZero(month);
    day = padWithZero(day);

    // obj is true, return an object
    if (obj) {
        return {
            year: year,
            month: parseInt(month),
            day: parseInt(day),
            cDay: date.getDay()
        }
    }

    // return a string
    return year + "-" + month + "-" + day;
}
