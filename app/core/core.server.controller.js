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
  if (!config.defaultPage || ~exts.indexOf(ext)) { // if not in extentions give 404
    // next();
    renderNotFound(req, res); // We know its not found
  } else {
    var rootDir = path.normalize(config.staticFiles);
    res.sendFile(config.defaultPage, {
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

exports.getModuleConfig = function (req, res) {
  var config = req.app.locals.config;

  var response = {};
  response.appLogo = config.appLogo;
  response.APP_TITLE = config.APP_TITLE;
  response.imageUploadApi = config.imageUploadApi;
  response.appBase = config.appBase;
  response.MENU_CONFIG = config.MENU_CONFIG;
  response.appClientConfig = config.APP_CLIENT_CONFIG;
  response.RECAPTCHA_SITE_KEY = config.app.RECAPTCHA_SITE_KEY;
  response.owasp = config.shared.owasp;

  if (!req.user || !config.appName) {
    return res.json(response);
  } else {
    response.user = req.user;

    return res.json(response);
  }
};