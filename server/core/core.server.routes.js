import * as core from  './core.server.controller.js';

export default function (app) {
  // Root routing

  // Define error pages
  app.route('/server-error').get(core.renderServerError);

  // Return a 404 for all undefined api, module or lib routes
  app.route('/:url(api|modules|lib)/*').get(core.renderNotFound);

  // Define application route
  // Will first check for webcrawlers to enable server-side rendering
  app.route('/*').get(core.prerender, core.renderIndex);
}
