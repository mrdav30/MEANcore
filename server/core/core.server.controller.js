'use strict';

var path = require('path');

/**
 * Get extention from path
 */
function getExtention(url) {
  return url.split('.').pop();
}

/**
 * Render the server not found responses
 */
var renderNotFound = function (req, res) {
  res.status(404).json({
    error: 'Path not found'
  });
};
exports.renderNotFound = renderNotFound;

/**
 * Render the main application page
 */
exports.renderIndex = function (req, res) {
  var config = req.app.locals.config;
  var ext = getExtention(req.url);
  // TODO: change the way to identify extentions
  var exts = ['html', 'css', 'js', 'pdf', 'jpeg', 'gif', 'png'];
  if (!config.app.defaultPage || ~exts.indexOf(ext)) { // if not in extentions give 404
    // next();
    renderNotFound(req, res); // We know its not found
  } else {
    var rootDir = path.normalize(config.staticFiles);
    res.sendFile(config.app.defaultPage, {
      root: rootDir
    });
  }
};

/**
 * Render the server error page
 */
exports.renderServerError = function (req, res) {
  res.status(500).jsonp({
    error: 'Oops! Something went wrong...'
  });
};
