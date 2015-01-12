// Dependencies
var Contributions = require("../contributions");

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

            // Prepare the repository download link
            repoLink = "/repos/" + repoLink + ".zip";

            // Success
            client.emit("complete", {
                error: null
              , output: repoLink
            });
        }, function (progress) {
            client.emit("progress", {
                message: progress.toFixed(2) + " Completed"
              , value: progress
            });
        });
    }
};
