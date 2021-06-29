import {
  normalize
} from 'path';
import _ from 'lodash';
import puppeteer from 'puppeteer';

let browserWSEndpoint = null;

/**
 * Get extention from path
 */
const getExtension = (url) => {
  return _.split(url, '.').pop();
}

/**
 * Render the server not found responses
 */
export const renderNotFound = (req, res) => {
  res.status(404).send({
    message: 'Path not found'
  });
}

// check for webcrawlers and prerender
// otherwise move on to render index
export const prerender = async (req, res, next) => {
  const config = req.app.locals.config;
  if (!config.helpers.isBot(req.headers['user-agent'])) {
    return next();
  } else {
    if (typeof req.query.headless != 'undefined') {
      return next();
    } else {
      if (!browserWSEndpoint) {
        const browser = await puppeteer.launch();
        browserWSEndpoint = browser.wsEndpoint();
      }

      const url = `${req.protocol}://${req.get('host')}${req.url}`;
      const {
        html,
        ttRenderMs
      } = await config.services.ssr(url, browserWSEndpoint);
      // Add Server-Timing! See https://w3c.github.io/server-timing/.
      res.set('Server-Timing', `Prerender;dur=${ttRenderMs};desc="Headless render time (ms)"`);
      return res.status(200).send(html + '<!-- SSR -->'); // Serve prerendered page as response.
    }
  }
}

/**
 * Render the main application page
 */
export const renderIndex = (req, res) => {
  const config = req.app.locals.config;
  const ext = getExtension(req.url);
  // TODO: change the way to identify extentions
  const exts = ['html', 'css', 'js', 'pdf', 'jpeg', 'gif', 'png'];
  // if not in extentions give 404
  if (!config.app.defaultPage || ~exts.indexOf(ext)) {
    // We know its not found
    renderNotFound(req, res);
  } else {
    const indexPath = normalize(config.app.defaultPage);
    res.render(indexPath, config.app, (err, indexHtml) => {
      return res.status(200).send(indexHtml);
    });
  }
}

/**
 * Render the server error page
 */
export const renderServerError = (req, res) => {
  res.status(500).send({
    error: 'Oops! Something went wrong...'
  });
}
