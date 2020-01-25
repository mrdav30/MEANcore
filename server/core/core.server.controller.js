'use strict';

var path = require('path'),
  _ = require('lodash'),
  config = require(path.resolve('./config/config')),
  isBot = config.helpers.isBot,
  puppeteer = require('puppeteer'),
  ssrService = config.services.ssrService;

let browserWSEndpoint = null;

/**
 * Get extention from path
 */
function getExtention(url) {
  return _.split(url, '.').pop();
}

/**
 * Render the server not found responses
 */
var renderNotFound = function (req, res) {
  res.status(404).send({
    message: 'Path not found'
  });
};
exports.renderNotFound = renderNotFound;

// check for webcrawlers and prerender
// otherwise move on to render index
exports.prerender = async function (req, res, next) {
  if (!isBot(req.headers['user-agent'])) {
    return next();
  } else {
    if (typeof req.query.headless != 'undefined') {
      return next();
    } else {
      if (!browserWSEndpoint) {
        const browser = await puppeteer.launch();
        browserWSEndpoint = browser.wsEndpoint();
      };

      const url = `${req.protocol}://${req.get('host')}${req.url}`;
      const {
        html,
        ttRenderMs
      } = await ssrService.ssr(url, browserWSEndpoint);
      // Add Server-Timing! See https://w3c.github.io/server-timing/.
      res.set('Server-Timing', `Prerender;dur=${ttRenderMs};desc="Headless render time (ms)"`);
      return res.status(200).send(html + '<!-- SSR -->'); // Serve prerendered page as response.
    }
  };
}

/**
 * Render the main application page
 */
exports.renderIndex = async function (req, res) {
  var config = req.app.locals.config;
  var ext = getExtention(req.url);
  // TODO: change the way to identify extentions
  var exts = ['html', 'css', 'js', 'pdf', 'jpeg', 'gif', 'png'];
  // if not in extentions give 404
  if (!config.app.defaultPage || ~exts.indexOf(ext)) {
    // We know its not found
    renderNotFound(req, res);
  } else {
    var indexPath = path.normalize(config.app.defaultPage);
    res.render(indexPath, config.app, function (err, indexHtml) {
      return res.status(200).send(indexHtml);
    });
  }
};

/**
 * Render the server error page
 */
exports.renderServerError = function (req, res) {
  res.status(500).send({
    error: 'Oops! Something went wrong...'
  });
};
