var WebSocketServer = require('websocket').server;
var HTTPServer = require('http');

var PageThePusherServer = function(port) {
	this.server = null;
	
	if (port === undefined)
		port = 8124;
	var httpServer = HTTPServer.createServer(function(request, response) {
		console.log((new Date()) + ' Received request for ' + request.url);
		response.writeHead(404);
		response.end();
	});
	httpServer.listen(port, function() {
		console.log((new Date()) + ' Server is listening on port ' + port);
	});
	this.server = new WebSocketServer({
		httpServer: httpServer,
		autoAcceptConnections: false
	});
}

PageThePusherServer.prototype.on = function(event, handler) {
	return this.server.on(event, handler);
}

module.exports = PageThePusherServer;