// require Johnny's static
var JohnnysStatic = require("johnnys-node-static"),
    http = require('http');

// set static server: public folder
JohnnysStatic.setStaticServer({root: "./public"});
var Contributions = require("./contributions");

// set routes
JohnnysStatic.setRoutes({
    "/":       { "url": "/html/index.html" }
});

// create http server
http.createServer(function(req, res) {

    // safe serve
    if (JohnnysStatic.exists(req, res)) {
        // serve file
        JohnnysStatic.serve(req, res, function (err) {
            // not found error
            if (err.code === "ENOENT") {
                res.end("404 - Not found.");
                return;
            }

            // other error
            res.end(JSON.stringify(err));
        });
        return;
    }

    if (req.url === "/get-zip") {
        console.log("... > Get zip");
        res.end("Implementing soon...");
        return;
    }

    // serve file
    JohnnysStatic.serveAll(req, res, function(err, result) {
        // check for error
        if (err) {
            res.writeHead(err.status, err.headers);
            res.end();
        } else {
            console.log('%s - %s', req.url, result.message);
        }
    });
}).listen(9000);
console.log("Listening on 9000");
