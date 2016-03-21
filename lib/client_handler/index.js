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
        
        // Use Script to open local file with local path
        function Openfile(i, path) {
            // !Optimized: use child_process module to open local file with local path
            (function() {
                var cmdArr = [
                    'nautilus ' + path
                  , 'start "" "' + path + '"'
                  , 'konqueror ' + path
                  , 'open ' + path
                ]
                ;
                
                if (i >= cmdArr.length) {
                    client.emit("complete", {
                        error: null
                      , output: path
                      , mannual: true
                    });
                }
                
                // recursive calling
                exec(cmdArr[i], function (err, stdout, stderr) {
                    if (err == null) {
                        // Success
                        client.emit("complete", {
                            error: null
                          , output: path
                          , mannual: false
                        });
                    } else {
                        Openfile(++i, path);
                    }
                });
            })();
        }

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
            
            // From index 0 to try to open file
            Openfile(0, repoLink);
        }, function (progress) {
            client.emit("progress", {
                message: progress.toFixed(2) + " Completed"
              , value: progress
            });
        });
    }
};
