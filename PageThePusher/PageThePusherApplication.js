var PageThePusherServer = require('./PageThePusherServer');
var PageThePusherRequest = require('./PageThePusherRequest');
var PageThePusherLogger = require('./PageThePusherLogger');
var PageThePusherConnectionMap = require('./PageThePusherConnectionMap');

var logger = new PageThePusherLogger();

var PageThePusherApplication = {
	server: null,
	connectionMap: null,
	start: function() {
		this.server = new PageThePusherServer(8124);
		this.connectionMap = new PageThePusherConnectionMap();
		
		this.server.on('request', this.handlers.requestHandler.bind(this));
		this.server.on('connect', this.handlers.connectHandler.bind(this));
		this.server.on('close', this.handlers.closeHandler.bind(this));
	},
	originIsAllowed: function() {
		return true;
	},
	openURL: function(channel, url, connection) {
		logger.log('OPEN URL: ' + JSON.stringify({from: connection.remoteAddress, channel: channel, url: url}));
		if (this.connectionMap[channel] === undefined)
			return;
		var targets = this.connectionMap[channel];
		targets.each(function(targetConnection) {
			if (targetConnection !== connection)
				targetConnection.send(JSON.stringify({method: 'openURL', data: {url: url}}));
		});
	},
	refreshChannels: function(channels, connection) {
		var beforeRefreshChannels = this.connectionMap.getChannelsFromConnection(connection);
		this.connectionMap.removeAllChannelsFromConnection(connection);
		channels.each(function(channel) {
			this.connectionMap.addChannelToConnection(connection, channel);
		}.bind(this));
		logger.log('AFTEAR REFRESH: ' + JSON.stringify({from: connection.remoteAddress, before: beforeRefreshChannels, after: this.connectionMap.getChannelsFromConnection(connection)}));
	},
	handlers: {
		requestHandler: function(request) {
			logger.log('REQUEST: ' + JSON.stringify({from: request.remoteAddress}));
			if (!this.originIsAllowed(request.origin)) {
				request.reject();
				logger.log('REQUEST REJECTED: ' + JSON.stringify({from: request.remoteAddress}));
				return;
			}
			logger.log('REQUEST ACCEPTED: ' + JSON.stringify({from: request.remoteAddress}));
			var connection = request.accept(null, request.origin);
		},
		connectHandler: function(connection) {
			logger.log('CONNECTED: ' + JSON.stringify({from: connection.remoteAddress}));
			
			var ppRequest = new PageThePusherRequest(connection, 'getListenChannels');
			ppRequest.on('response', function(response) {
				logger.log('INIT LISTEN CHANNEL: ' + JSON.stringify({from: connection.remoteAddress, channels: response}));
				response.each(function(channel) {
					this.connectionMap.addChannelToConnection(connection, channel);
				}.bind(this));
				connection.on('message', this.handlers.messageDispatchHandler);
			}.bind(this));
			ppRequest.send();
		},
		messageDispatchHandler: function(message) {
			var message = JSON.parse(message.utf8Data);
			switch (message.method) {
				case 'openURL':
					PageThePusherApplication[message.method](message.data.channel, message.data.url, this);
					break;
				case 'refreshChannels':
					PageThePusherApplication[message.method](message.data, this);
					break;
			}
		},
		closeHandler: function(connection, closeReason, description) {
			this.connectionMap.removeAllChannelsFromConnection(connection);
			logger.log('DISCONNECTED: ' + JSON.stringify({from: connection.remoteAddress, description: description}));
			console.log(this.connectionMap.dump());
		}
	}
}

module.exports = PageThePusherApplication;