var isObject = require('lodash.isobject');
var isArray = require('lodash.isarray');
var isUrl = require('is-url');

var Redirect = require('./lib/redirect');

module.exports = function (config) {
  var redirects = [];
  if (isArray(config)) {
    config.forEach(function(redir) {
      redirects.push(new Redirect(redir.source, redir.destination, redir.type));
    });
  } else if (isObject(config)) {
    // handle legacy object map format
    for (var source in config) {
      if (isObject(config[source])) {
        redirects.push(
          new Redirect(source, config[source].url, config[source].status)
        );
      } else {
        redirects.push(new Redirect(source,config[source],301));
      }
    }
  } else {
    throw new Error("Redirects provided in an unrecognized format");
  }

  var matcher = function(url) {
    for (var i = 0; i < redirects.length; i++) {
      var result = redirects[i].test(url);
      if (result) return result;
    }
  }

  return function (req, res, next) {
    var match = matcher(req.url);

    if (!match) {
      return next();
    }

    // Remove leading slash of a url
    var redirectUrl = formatExternalUrl(match.destination);

    res.writeHead(match.type, {Location: redirectUrl});
    res.end();
  };
};

function formatExternalUrl (u) {

  var cleaned = u
    .replace('/http:/', 'http://')
    .replace('/https:/', 'https://');

  return (isUrl(cleaned)) ? cleaned : u;
}
