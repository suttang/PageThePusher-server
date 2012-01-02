var util = require('util');
var EventEmitter = require('events').EventEmitter;

var PageThePusherRequest = function(connection, method, data) {
	this.connection = connection;
	this.method = method;
	this.data = data || '';
}

util.inherits(PageThePusherRequest, EventEmitter);

PageThePusherRequest.prototype.send = function() {
	this.connection.once('message', function(data) {
		this.emit('response', JSON.parse(data.utf8Data));
	}.bind(this));
	this.connection.send(JSON.stringify({method: this.method, data: this.data}));
}

module.exports = PageThePusherRequest;