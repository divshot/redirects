var isObject = require('lodash.isobject');
var isArray = require('lodash.isarray');
var minimatch = require('minimatch');
var pathematics = require('pathematics');
var slasher = require('glob-slasher');
var isUrl = require('is-url');
var pathToRegexp = require('path-to-regexp');

module.exports = function (config) {
  if (isArray(config)) {
    var redirects = config;
  } else if (isObject(config)) {
    // handle legacy object map format
    var redirects = [];
    for (var source in config) {
      if (isObject(config[source])) {
        redirects.push({
          source: source,
          destination: config[source].url,
          type: config[source].status || 301
        });
      } else {
        redirects.push({
          source: source,
          destination: config[source],
          type: 301
        });
      }
    }
  } else {
    throw new Error("Redirects provided in an unrecognized format");
  }

  for (var i = 0; i < redirects.length; i++) {
    // normalize the sources with leading slashes
    redirects[i].source = slasher(redirects[i].source);
    if (redirects[i].destination.indexOf(":") >= 0) {
      redirects[i].regexpKeys = [];
      redirects[i].regexp = pathToRegexp(redirects[i].source, redirects[i].regexpKeys);
      redirects[i].regexpCompiled = pathToRegexp.compile(redirects[i].destination);
    }
  }

  var matcher = function(url) {
    for (var i = 0; i < redirects.length; i++) {
      if (redirects[i].regexp) var regexpMatch = redirects[i].regexp.exec(url);

      if (regexpMatch) {
        var params = {};
        for (var j = 0; j < redirects[i].regexpKeys.length; j++) {
          params[redirects[i].regexpKeys[j].name] = regexpMatch[j + 1];
        }
        return {
          type: redirects[i].type,
          destination: redirects[i].regexpCompiled(params)
        }
      } else if (minimatch(url,redirects[i].source)) {
        return redirects[i];
      }
    }
    return null;
  }

  return function (req, res, next) {

    var match = matcher(req.url);
    var redirectObj;

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
