var util = require('util');

var PageThePusherConnectionMap = function() {
	
}

PageThePusherConnectionMap.prototype.addChannelToConnection = function(connection, channel) {
	if (this[channel] === undefined)
		this[channel] = [];
	if (this[channel].contains(connection))
		return;
	this[channel].push(connection);
}
PageThePusherConnectionMap.prototype.removeAllChannelsFromConnection = function(connection) {
	for (channelName in this) {
		if (!(this[channelName] instanceof Array))
			continue;
		this[channelName].erase(connection);
	}
}
PageThePusherConnectionMap.prototype.getChannelsFromConnection = function(connection) {
	var channels = [];
	for (channelName in this) {
		if (!(this[channelName] instanceof Array))
			continue;
		if (this[channelName].contains(connection))
			channels.push(channelName);
	}
	return channels;
}
PageThePusherConnectionMap.prototype.dump = function() {
	return util.inspect(this);
}

module.exports = PageThePusherConnectionMap;