var WebSocketServer = require('websocket').server;
var http = require('http');
var connection = null;

let reqIdCounter = 0;
let reqContainer = {};

var server = http.createServer(function (request, response) {
    if (connection == null) {
        response.writeHead(200);
        response.end(JSON.stringify(
            {
                "fulfilmentText": "Aucun centre de raisonnement n'est connecté au cluster..."
            }));
        return;        
    }

    if (request.method != 'POST') {
        response.end(JSON.stringify(
            {
                "error": "This api only accept 'POST' requests."
            }));
        return;
    }
    
    let body = '';
    request.on('data', function (data) {
        body += data;
    });
    request.on('end', function () {
        reqContainer[reqIdCounter] = response;

        connection.send(JSON.stringify(
            {
                "id": reqIdCounter,
                "data": JSON.parse(body)
            }));
        ++reqIdCounter;
    });
});
server.listen(8080, function () { });

// create the server
wsServer = new WebSocketServer({
    httpServer: server
});

// WebSocket server 
wsServer.on('request', function (request) {
    connection = request.accept(null, request.origin);
    console.log("client connecté");

    // This is the most important callback for us, we'll handle
    // all messages from users here.
    connection.on('message', function (message) {
        let msgStr = (message.binaryData.toString('utf8'));
        let msg = JSON.parse(msgStr);
        let id = msg["id"];
        let response = reqContainer[id];

        response.end(JSON.stringify(msg["data"]));
    });

    connection.on('close', function (connection) {
        connection = null;
    });
});