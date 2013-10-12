// require Johnny's static
var JohhnysStatic = require("johnnys-node-static"),
    http = require('http');

// set static server: public folder
JohhnysStatic.setStaticServer({root: "./public"});
var Contributions = require("./contributions");

// set routes
JohhnysStatic.setRoutes({
    "/":       { "url": "/html/index.html" }
});

// create http server
http.createServer(function(req, res) {

    // safe serve
    if (JohhnysStatic.exists(req, res)) {
        // serve file
        JohhnysStatic.serve(req, res, function (err) {
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

    // serve file
    JohhnysStatic.serveAll(req, res, function(err, result) {
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
