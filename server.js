// require Johnny's static
var JohnnysStatic = require("johnnys-node-static"),
    http = require('http'),
    qs   = require('querystring');

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
        getFormData(req, res, function (err, formData) {

            // TODO This is a hack. How can we solve this?
            for (var first in formData) { formData = first; break; }

            if (err) { return sendResponse(req, res, err, 400); }
            if (typeof formData === "string") {
                try {
                    formData = JSON.parse(formData);
                } catch (e) {
                    return sendResponse(req, res, e, 400);
                }
            }
            if (formData.constructor !== Object) {
                return sendResponse(req, res, "Invalid request data.", 400);
            }


            Contributions.getRepo({

            }, function (err, repoData) {
                if (err) { return sendResponse(req, res, err, 400); }
                sendResponse(req, res, repoData);
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

/*
 *  Returns the form data
 *
 * */
function getFormData(request, response, callback) {

    if (typeof response === "function") {
        callback = response;
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
