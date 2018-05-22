'use strict';
var http = require('http');
var port = process.env.PORT || 8080;
console.log("Lancement de l'application sur le port: " + port + "...");

http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello World\n');
}).listen(port);
