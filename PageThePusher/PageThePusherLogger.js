var util = require('util');
var fs = require('fs');

var PageThePussherLogger = function() {
	this.logs = [];
	var date = new Date();
	var todaysPassageSeconds = date.getHours() * 24 * 60 + date.getMinutes() * 60 + date.getSeconds();
	var lastTodaysSeconds = 24 * 60 * 60 - todaysPassageSeconds;
	setTimeout(function() {
		this.logging();
		setInterval(this.logging.bind(this), 24 * 60 * 60 * 1000);
	}.bind(this), lastTodaysSeconds * 1000);
}

PageThePussherLogger.prototype.log = function(log) {
	this.logs.push(log);
	util.log(log);
}
PageThePussherLogger.prototype.save = function() {
	util.log(log);
}
PageThePussherLogger.prototype.logging = function() {
	this.save();
	this.logs.empty();
}


module.exports = PageThePussherLogger;