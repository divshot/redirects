var minimatch = require('minimatch');
var pathToRegexp = require('path-to-regexp');
var slasher = require('glob-slasher');

var Redirect = function(source, destination, type) {
  this.type = type || 301;
  this.source = slasher(source);
  this.destination = destination;

  if (this.destination.match(/(?:^|\/):/)) {
    this.captureKeys = [];
    this.capture = pathToRegexp(this.source, this.captureKeys);
    this.compileDestination = pathToRegexp.compile(this.destination);
  }
}

Redirect.prototype.test = function(url) {
  if (this.capture) var match = this.capture.exec(url);
  if (match) {
    var params = {};
    for (var i = 0; i < this.captureKeys.length; i++) {
      params[this.captureKeys[i].name] = match[i + 1];
    }

    return {
      type: this.type,
      destination: this.compileDestination(params)
    };
  } else if (minimatch(url,this.source)) {
    return {
      type: this.type,
      destination: this.destination
    };
  }
}

module.exports = Redirect;
