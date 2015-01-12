// Dependencies
var Contributions = require("./contributions")
  , Lien = require("lien");
  , SocketIO = require("socket.io")
  , ClientHandlers = require("./lib")
  ;

// Init lien server
var app = new Lien({
    host: "localhost"
  , port: 9000
  , root: _dirname + "/public"
});

// Add page
server.page.add("/", function (lien) {
    lien.file("/html/index.html");
});

// Socket.io server listens to our app
var io = SocketIO.listen(server._server, { log: false });

// Listen for connections
io.sockets.on("connection", function (client) {
    client.on("getZip", function (clientData) {

        if (client._generatingZip) {
            return client.emit("complete", {
                error: "The generator already is generating a repository. If you are not patient, try to generate another in a new tab"
            });
        }

        // parse form data
        if (typeof clientData === "string") {
            try {
                clientData = JSON.parse(clientData);
            } catch (e) {
                return client.emit("complete", {
                    error: "Cannot parse request data"
                });
            }
        }

        // validate form data
        if (clientData.constructor !== Object) {
            return client.emit("complete", {
                error: "Invalid request data"
            });
        }

        client._generatingZip = true;
        // generate repository
        Contributions.getRepo(clientData, function (err, repoLink) {

            client._generatingZip = false;
            // handle error
            if (err) {
                return client.emit("complete", {
                    error: err.text || err.toString() || err
                });
            }

            // prepare the repository download link
            repoLink = repoLink.substring(6);

            // success
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
    });
});

console.log("Listening on 9000");
