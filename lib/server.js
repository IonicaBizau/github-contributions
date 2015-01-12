// Dependencies
var Lien = require("lien")
  , SocketIO = require("socket.io")
  , ClientHandler = require("./client_handler")
  , Contributions = require("./contributions")
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
    client.on("getZip", ClienHandler(client));
});

console.log("Listening on 9000");
