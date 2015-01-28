// Dependencies
var Fs = require("fs")
  , Ul = require("ul")
  , Repo = require("gry")
  , Calendar = require("./calendar")
  , Path = require("path")
  , Archiver = require('archiver');
  ;

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
var GenerateRepository = module.exports = function (options, done, progress) {

    // Defaults
    done = done || function () {};
    progress = progress || function () {};

    // Coordinates
    if (!options.coordinates) {
        return done(new Error("Missing the coordinates."));
    }

    // Validate coordinates
    if (options.coordinates.constructor !== Array) {
        return done(new Error("Invalid coordinates field value. It must be an array."));
    }

    // Merge defaults
    options = Ul.merge({
        "time": {
            "hour": 10
        }
    }, options);

    // Append date things to the options
    Calendar(options);

    // generate the repository path
    var repoId = Math.random().toString(36).substring(3)
      , publicDir = Path.resolve(__dirname + "/../public/repos")
      , repoPath = publicDir + "/" + repoId
      , numberOfCommits = options.coordinates.length * options.commitsPerDay
      , readmeFilePath = repoPath + "/README.md"
      , completedCommits = 0
      , repo = new Repo(repoPath)
      ;

    /**
     * dummyCommit
     * Creates a dummy commit.
     *
     * @name dummyCommit
     * @function
     * @param {String} message The commit message.
     * @param {Function} callback The callback function.
     * @return {undefined}
     */
    function dummyCommit(message, date, callback) {
        var options = date ? "--date " + date : "";
        Fs.writeFile(readmeFilePath, Math.random().toString(), function (err) {
            if (err) { return callback(err); }
            repo.add(function (err) {
                if (err) { return callback(err); }
                repo.commit(message, options, callback);
            });
        });
    }

    /**
     * initialCommit
     * Creates the repository and the initial commit.
     *
     * @name initialCommit
     * @function
     * @param {Function} callback The callback function.
     * @return {undefined}
     */
    function initialCommit(callback) {
        repo.create(function (err) {
            if (err) { return callback(err); }
            dummyCommit("Initial commit", "", callback);
        });
    }

    /*!
     * lastCommit
     * Creates the last commit.
     *
     * @name lastCommit
     * @function
     * @return {undefined}
     */
    function lastCommit() {
        Fs.writeFile(readmeFilePath,
            "My GitHub Contributions Calendar"
          + "\n================================"
          + "\nThis repository was generated with [GitHub Contributions](https://github.com/IonicaBizau/github-contributions) generator. Thanks, [@IonicaBizau](https://github.com/IonicaBizau)."
        , function (err) {
            if (err) { return done(err); }
            repo.add(function (err) {
                if (err) { return done(err); }
                repo.commit("Added the title and description (/cc. @IonicaBizau)", function (err) {
                    if (err) { return done(err); }
                    var output = Fs.createWriteStream(repoPath + ".zip")
                      , archive = Archiver("zip")
                      , zipErr = null
                      ;

                    output.on("close", function () {
                        done(zipErr, repoId);
                    });

                    archive.on("error", function(err){
                        zipErr = err;
                    });

                    archive.pipe(output);
                    archive.directory(repoPath, "source");
                    archive.finalize();
                });
            });
        });
    }

    initialCommit(function (err) {
        if (err) { return done(err); }
        var cDate = null
          ;

        function nextDay(id) {
            cDate = options.dates[id];
            if (!cDate) {
                return lastCommit();
            }

            function commitSeq(i) {

                if (i >= options.commitsPerDay) {
                    return nextDay(id + 1);
                }

                dummyCommit("Dummy", cDate + i * 60, function (err) {
                    if (err) { return done(err); }
                    progress(++completedCommits * 100 / numberOfCommits);
                    commitSeq(i + 1);
                });
            }

            commitSeq(0);
        }

        nextDay(0);
    });
};
