#!/usr/bin/env node

// Dependencies
var Lien = require("lien")
  , SocketIO = require("socket.io")
  , ClientHandler = require("./client_handler")
  ;

var host = process.env.SERVER_ADDRESS || "localhost";

// Init lien server
var app = new Lien({
    host: host
  , port: 9000
  , root: __dirname + "/public"
});

// Add page
app.page.add("/", function (lien) {
    lien.file("/html/index.html");
});

// Socket.io server listens to our app
var io = SocketIO.listen(app._server, { log: false });

// Listen for connections
io.sockets.on("connection", function (client) {
    client.on("getZip", ClientHandler(client));
});

console.log("Listening on "+ host +":9000");
