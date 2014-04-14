// dependencies
var JohnnysStatic = require("johnnys-node-static")
  , http = require('http')
  , qs   = require('querystring')
  , Contributions = require("./contributions")
  ;

// set static server: public folder
JohnnysStatic.setStaticServer({root: "./public"});

// set routes
JohnnysStatic.setRoutes({
    "/":       { "url": "/html/index.html" }
});

/*
 *  Returns the form data
 *
 * */
function getFormData(request, response, callback) {

    // handle response as function
    if (typeof response === "function") {
        callback = response;
        response = undefined;
    }

    // the request method must be 'POST'
    if (request.method == 'POST') {

        var body = '';

        // on data
        request.on('data', function (data) {
            // add data to body
            body += data;
            // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
            if (body.length > 1e6) {
                // FLOOD ATTACK OR FAULTY CLIENT, NUKE REQUEST
                request.connection.destroy();
            }
        });

        // and on end
        request.on('end', function () {
            // parse body
            var POST = qs.parse(body);
            // and callback it!
            callback(undefined, POST);
        });
        return;
    }

    // if it's  a get request, maybe we have some query data
    var queryData = Url.parse(request.url, true).query;

    // if not post, callback undefined
    callback(null, queryData);
}

/*
 *  Send response to the client
 * */
function sendResponse (req, res, content, status, contentType, force) {

    // if not provided, status is 200
    status = status || 200;

    // set the content type
    contentType = contentType || "application/json";

    // set headers and status code
    res.writeHead(status, {"Content-Type": contentType});

    // handle mongo errors
    if (content instanceof Error) {
        content = content.message;
    }

    // build response
    var response = (content || {}).constructor === Object ? content : {};

    // if content is string
    if (typeof content === "string") {

        // set output
        response.output = content;

        // but if it is an error
        if (status !== 200) {

            // set error
            response.error = content;

            // and delete output
            delete response.output;
        }
    }

    // if we force the response data
    if (force) {
        // force it!
        res.end(content);
        return;
    }

    // and end the response
    res.end(JSON.stringify(response, null, 4));
};

// create http server
var server = http.createServer(function(req, res) {

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

    // get zip route
    if (req.url === "/get-zip") {

        // get the form data
        getFormData(req, res, function (err, formData) {

            // TODO This is a hack. How can we solve this?
            for (var first in formData) { formData = first; break; }

            // handle error
            if (err) { return sendResponse(req, res, err, 400); }

            // parse form data
            if (typeof formData === "string") {
                try {
                    formData = JSON.parse(formData);
                } catch (e) {
                    return sendResponse(req, res, e, 400);
                }
            }

            // validate form data
            if (formData.constructor !== Object) {
                return sendResponse(req, res, "Invalid request data.", 400);
            }

            // generate repository
            Contributions.getRepo(formData, function (err, repoLink) {

                // handle error
                if (err) { return sendResponse(req, res, err, 400); }

                // prepare the repository download link
                repoLink = repoLink.substring(6);

                // send response
                sendResponse(req, res, repoLink);
            }, function (progress) {

                // TODO Send to the client that pressed "Generate repo"
                io.sockets.emit("progress", {
                    message: progress.toFixed(2) + " Completed"
                  , value: progress
                });
            });
        });
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

// Socket.io server listens to our app
var io = require('socket.io').listen(server, {log: false});
