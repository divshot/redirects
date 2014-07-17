var isObject = require('lodash.isobject');
var globject = require('globject');
var slash = require('slasher');
var pathematics = require('pathematics');

module.exports = function (redirectRouteMap) {
  return function (req, res, next) {
    var statusCode = 301;
    var normalizedRedirects = slash(redirectRouteMap);
    var redirects = globject(normalizedRedirects);
    var redirectUrl = redirects(req.url);
    var redirectObj;
    
    // redirect with segments
    if (!redirectUrl) {
      var parsedUrl = pathematics.withMeta(normalizedRedirects, req.url);
      redirectUrl = parsedUrl.url;
      statusCode = (parsedUrl.meta && parsedUrl.meta.status) ? parsedUrl.meta.status : statusCode;
    }
    
    // redrect from config object
    if (isObject(redirectUrl)) {
      redirectObj = redirectUrl;
      redirectUrl = redirectObj.url;
      statusCode = redirectObj.status || statusCode;
    }
    
    if (!redirectUrl) return next();
    
    res.writeHead(statusCode, {Location: redirectUrl});
    res.end();
  };
};