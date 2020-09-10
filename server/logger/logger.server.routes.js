import * as logger from './logger.server.controller.js';

export default function (app) {
  app.route('/api/log-error').post(logger.logError);
}
