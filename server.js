var http = require("http");
var Static = require('node-static');
var file = new(Static.Server)('./public');
var Contributions = require("./contributions");

var port = process.env.PORT || 5000;

http.createServer(function(req, res){


    if(req.url === "/get-zip") {
        if (req.method === "POST") {
            var data = "";

            req.on("data", function (dat) {
                data += dat.toString();
            });

            req.on("end", function () {
                Contributions.getRepo (JSON.parse(data), function (err, publicRepoUrl) {
                    res.end(JSON.stringify({ error: err, publicRepoUrl: publicRepoUrl }));
                });
            });

            req.on("error", function (err) {
                res.end(JSON.stringify(err));
            });

            return;
        }

        res.end("You must post something here.");
        return;
    }

    file.serve(req, res);
    // TODO 404
}).listen(port);
console.log("Listening on port " + port + ".");