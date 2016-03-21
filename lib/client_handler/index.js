// Dependencies
var Contributions = require("../contributions");
var exec = require('child_process').exec, child;

module.exports = function (client) {
    return function (clientData) {

        // Already generating
        if (client._generatingZip) {
            return client.emit("complete", {
                error: "The generator already is generating a repository. If you are not patient, try to generate another one in a new tab"
            });
        }

        // Parse form data
        if (typeof clientData === "string") {
            try {
                clientData = JSON.parse(clientData);
            } catch (e) {
                return client.emit("complete", {
                    error: "Cannot parse the request data"
                });
            }
        }

        // Validate form data
        if (clientData.constructor !== Object) {
            return client.emit("complete", {
                error: "Invalid request data"
            });
        }

        // Set generating zip to true
        client._generatingZip = true;

        // Generate repository
        Contributions(clientData, function (err, repoLink) {
            client._generatingZip = false;
            if (err) {
                return client.emit("complete", {
                    error: err.text || err.toString() || err
                });
            }

            // Prepare the path to the repository
            repoLink += "/";

            // !Optimized: use child_process module to open local file with local path
            (function() {
                exec('nautilus ' + repoLink, function (err, stdout, stderr) {
                    if (err != null) {
                        // Error to open
                        client.emit("complete", {
                            error: "The repository has already been in the path: <code>" + repoLink + "</code>"
                        });
                    } else {
                        // Success
                        client.emit("complete", {
                            error: null
                          , output: repoLink
                        });
                    }
                });
            })();

            
        }, function (progress) {
            client.emit("progress", {
                message: progress.toFixed(2) + " Completed"
              , value: progress
            });
        });
    }
};
