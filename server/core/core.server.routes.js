'use strict';

module.exports = function (app) {
  // Root routing
  var core = require('./core.server.controller');

  // Define error pages
  app.route('/server-error').get(core.renderServerError);

  // Return a 404 for all undefined api, module or lib routes
  app.route('/:url(api|modules|lib)/*').get(core.renderNotFound);

  // Define application route
  // Will first check for webcrawlers to enable server-side rendering
  app.route('/*').get(core.prerender, core.renderIndex);
};
