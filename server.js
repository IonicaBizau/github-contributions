// dependencies
var Statique = require ("statique")
  , http = require('http')
  , qs   = require('querystring')
  , Contributions = require("./contributions")
  ;

// set static server: public folder
Statique.server({root: __dirname + "/public"})
Statique.setRoutes({"/": "/html/index.html"});

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


    // serve files
    Statique.serve (req, res);
}).listen(9000);
console.log("Listening on 9000");

// Socket.io server listens to our app
var io = require('socket.io').listen(server, {log: false});

// listen for connections
io.sockets.on('connection', function (client) {
    client.on ("getZip", function (clientData) {

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

            client._generatingZip = true;
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
