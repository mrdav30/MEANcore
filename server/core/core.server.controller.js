'use strict';

var path = require('path'),
  config = require(path.resolve('./config/config')),
  isBot = config.helpers.isBot,
  ssrService = config.services.ssrService;

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
exports.renderIndex = async function (req, res) {
  var config = req.app.locals.config;
  var ext = getExtention(req.url);
  // TODO: change the way to identify extentions
  var exts = ['html', 'css', 'js', 'pdf', 'jpeg', 'gif', 'png'];
  if (!config.app.defaultPage || ~exts.indexOf(ext)) { // if not in extentions give 404
    renderNotFound(req, res); // We know its not found
  } else {
    if (!isBot(req.headers['user-agent'])) {
      var rootDir = path.normalize(config.staticFiles);
      res.sendFile(config.app.defaultPage, {
        root: rootDir
      });
    } else {
      const {
        html,
        ttRenderMs
      } = await ssrService.ssr(`${req.protocol}://${req.get('host')}/index.html`);
      // Add Server-Timing! See https://w3c.github.io/server-timing/.
      res.set('Server-Timing', `Prerender;dur=${ttRenderMs};desc="Headless render time (ms)"`);
      return res.status(200).send(html); // Serve prerendered page as response.
    };
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
